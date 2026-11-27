import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/error-handler';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'afriasset-backend' });
  });

  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
};
