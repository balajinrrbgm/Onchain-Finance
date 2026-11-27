import { execSync } from 'node:child_process';
import { prisma } from '../services/prisma';

let schemaReady = false;

export const ensureTestDatabase = () => {
  if (!schemaReady) {
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'ignore',
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL ?? 'file:./test.db' }
      });
      schemaReady = true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to run prisma migrate deploy for tests', error);
    }
  }

  return schemaReady;
};

export const resetDatabase = async () => {
  ensureTestDatabase();

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF');
  const tables = ['Remittance', 'Loan', 'FractionalToken', 'Asset', 'User'];
  for (const table of tables) {
    const result = (await prisma.$queryRawUnsafe(
      `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='${table}'`
    )) as Array<{ count: number }>;
    if ((result?.[0]?.count ?? 0) > 0) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
    }
  }
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
};
