import { loanRepository } from '../repositories/loan-repository';
import { LoanApplicationInput, loanApplicationSchema, loanStatusUpdateSchema } from '../domain/schemas';
import { assetRepository } from '../repositories/asset-repository';
import { logger } from '../config/logger';

const assessLoanRisk = async (input: LoanApplicationInput) => {
  let score = 0.5;

  if (input.assetId) {
    const asset = await assetRepository.findById(input.assetId);
    if (asset?.valuationUsd) {
      const ltv = input.amountUsd / asset.valuationUsd;
      if (ltv <= 0.5) {
        score += 0.3;
      } else if (ltv <= 0.7) {
        score += 0.1;
      } else {
        score -= 0.2;
      }
    }

    if (asset?.tokenization) {
      score += 0.1;
    }
  }

  if (input.interestApr <= 25) {
    score += 0.05;
  }

  if (input.termMonths <= 12) {
    score += 0.05;
  }

  return Math.max(0, Math.min(1, score));
};

export const loanService = {
  apply: async (payload: unknown) => {
    const parsed = loanApplicationSchema.parse(payload);
    const score = await assessLoanRisk(parsed);
    const loan = await loanRepository.create(parsed, score);
    logger.info({ loanId: loan.id, score }, 'Loan application processed');
    return { loan, score };
  },
  updateStatus: async (loanId: string, payload: unknown) => {
    const parsed = loanStatusUpdateSchema.parse(payload);
    const updated = await loanRepository.updateStatus(loanId, parsed.status);
    logger.info({ loanId, status: parsed.status }, 'Loan status updated');
    return updated;
  },
  get: (id: string) => loanRepository.findById(id)
};
