import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './services/prisma';

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info({ port: env.port }, 'AfriAsset backend listening');
});

const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ error }, 'Uncaught exception');
});
