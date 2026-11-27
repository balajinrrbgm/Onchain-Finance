import { Router } from 'express';
import { sendRemittance } from '../controllers/remittance-controller';

export const remittanceRouter = Router();

remittanceRouter.post('/', sendRemittance);
