import { Router } from 'express';
import { userRouter } from './users';
import { assetRouter } from './assets';
import { loanRouter } from './loans';
import { remittanceRouter } from './remittances';
import { analyticsRouter } from './analytics';

export const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/assets', assetRouter);
apiRouter.use('/loans', loanRouter);
apiRouter.use('/remittances', remittanceRouter);
apiRouter.use('/analytics', analyticsRouter);
