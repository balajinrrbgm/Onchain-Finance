import type { Request, Response } from 'express';
import { analyticsService } from '../services/analytics-service';

export const getImpactMetrics = async (req: Request, res: Response) => {
  const data = await analyticsService.impact(req.query);
  res.json(data);
};
