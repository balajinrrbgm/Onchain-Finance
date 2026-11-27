import { prisma } from './prisma';
import { impactFilterSchema } from '../domain/schemas';

export const analyticsService = {
  impact: async (query: unknown) => {
    const filters = impactFilterSchema.parse(query);

    const [assetCount, loanCount, totalValuation, totalLoanAmount] = await Promise.all([
      prisma.asset.count({ where: { status: 'TOKENIZED', category: filters.assetCategory } }),
      prisma.loan.count({ where: { status: 'DISBURSED' } }),
      prisma.asset.aggregate({
        where: { status: 'TOKENIZED', category: filters.assetCategory },
        _sum: { valuationUsd: true }
      }),
      prisma.loan.aggregate({ where: { status: 'DISBURSED' }, _sum: { amountUsd: true } })
    ]);

    return {
      tokenizedAssets: assetCount,
      activeLoans: loanCount,
      totalValuationUsd: totalValuation._sum.valuationUsd ?? 0,
      totalLoansUsd: totalLoanAmount._sum.amountUsd ?? 0,
      estimatedHouseholdsServed: assetCount * 20,
      sdgAlignment: ['1 No Poverty', '8 Decent Work', '9 Industry Innovation']
    };
  }
};
