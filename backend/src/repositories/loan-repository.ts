import type { LoanStatus } from '../domain/constants';
import { LoanApplicationInput } from '../domain/schemas';
import { prisma } from '../services/prisma';

export const loanRepository = {
  create: (input: LoanApplicationInput, score: number) =>
    prisma.loan.create({
      data: {
        borrowerId: input.borrowerId,
        assetId: input.assetId,
        amountUsd: input.amountUsd,
        interestApr: input.interestApr,
        termMonths: input.termMonths,
        repaymentCycle: input.repaymentCycle,
        status: score >= 0.6 ? 'APPROVED' : 'PENDING'
      },
      include: { borrower: true, asset: true }
    }),
  updateStatus: (id: string, status: LoanStatus) =>
    prisma.loan.update({ where: { id }, data: { status } }),
  findById: (id: string) =>
    prisma.loan.findUnique({ where: { id }, include: { borrower: true, asset: true } }),
  listByBorrower: (borrowerId: string) =>
    prisma.loan.findMany({ where: { borrowerId }, include: { asset: true } })
};
