import { execSync } from 'node:child_process';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./dev.db';
process.env.HEDERA_ACCOUNT_ID = '0.0.1234';
process.env.HEDERA_PRIVATE_KEY = '302e020100300506032b657004220420' + 'a'.repeat(64);

jest.setTimeout(30_000);

try {
	execSync('npx prisma migrate deploy', { stdio: 'ignore' });
} catch (error) {
	// eslint-disable-next-line no-console
	console.warn('Failed to ensure test database schema', error);
}
