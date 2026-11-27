import type { Request, Response } from 'express';
import { remittanceService } from '../services/remittance-service';

export const sendRemittance = async (req: Request, res: Response) => {
  const record = await remittanceService.send(req.body);
  res.status(201).json(record);
};
