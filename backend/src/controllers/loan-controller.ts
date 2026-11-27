import type { Request, Response } from 'express';
import { loanService } from '../services/loan-service';

export const applyForLoan = async (req: Request, res: Response) => {
  const { loan, score } = await loanService.apply(req.body);
  res.status(201).json({ loan, score });
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  const updated = await loanService.updateStatus(req.params.loanId, req.body);
  res.json(updated);
};

export const getLoan = async (req: Request, res: Response) => {
  const loan = await loanService.get(req.params.loanId);
  if (!loan) {
    res.status(404).json({ message: 'Loan not found' });
    return;
  }
  res.json(loan);
};
