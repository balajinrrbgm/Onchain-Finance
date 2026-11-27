import { Router } from 'express';
import { applyForLoan, getLoan, updateLoanStatus } from '../controllers/loan-controller';

export const loanRouter = Router();

loanRouter.post('/', applyForLoan);
loanRouter.patch('/:loanId/status', updateLoanStatus);
loanRouter.get('/:loanId', getLoan);
