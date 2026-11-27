import { Router } from 'express';
import { getImpactMetrics } from '../controllers/analytics-controller';

export const analyticsRouter = Router();

analyticsRouter.get('/impact', getImpactMetrics);
