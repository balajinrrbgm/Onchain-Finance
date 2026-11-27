import { prisma } from '../services/prisma';
import { loanService } from '../services/loan-service';
import { ensureTestDatabase, resetDatabase } from './prisma-utils';

describe('loanService', () => {
  beforeAll(async () => {
    ensureTestDatabase();
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('approves low LTV tokenized asset loans', async () => {
    const borrower = await prisma.user.create({
      data: {
        name: 'Grace Achieng',
        phone: '+254700000000',
        country: 'Kenya',
        role: 'BORROWER'
      }
    });

    const asset = await prisma.asset.create({
      data: {
        ownerId: borrower.id,
        name: 'Solar Mini-Grid',
        category: 'SOLAR',
        location: 'Kisumu, Kenya',
        valuationUsd: 60000,
        fractionalGoal: 60000,
        status: 'VERIFIED'
      }
    });

    await prisma.fractionalToken.create({
      data: {
        assetId: asset.id,
        hederaTokenId: '0.0.8888',
        totalShares: 60000,
        pricePerShareUsd: 1,
        treasuryAccount: '0.0.5005'
      }
    });

    const { loan, score } = await loanService.apply({
      borrowerId: borrower.id,
      assetId: asset.id,
      amountUsd: 25000,
      interestApr: 18,
      termMonths: 12,
      repaymentCycle: 'MONTHLY'
    });

    expect(score).toBeGreaterThanOrEqual(0.6);
    expect(loan.status).toBe('APPROVED');
  });
});
