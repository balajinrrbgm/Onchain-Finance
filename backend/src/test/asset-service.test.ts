import { prisma } from '../services/prisma';
import { assetService } from '../services/asset-service';
import { ensureTestDatabase, resetDatabase } from './prisma-utils';

jest.mock('../utils/hedera-client', () => ({
  createFractionalToken: jest.fn().mockResolvedValue('0.0.9999'),
  resetHederaClient: jest.fn()
}));

describe('assetService', () => {
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

  it('tokenizes a verified asset into a Hedera token', async () => {
    const owner = await prisma.user.create({
      data: {
        name: 'Awa Farmer',
        phone: '+221770000000',
        country: 'Senegal',
        role: 'INVESTOR'
      }
    });

    const onboarded = await assetService.onboard({
      ownerId: owner.id,
      name: 'Casamance Rice Farm',
      category: 'FARM',
      location: 'Ziguinchor, Senegal',
      valuationUsd: 50000,
      fractionalGoal: 50000,
      complianceUrl: 'https://example.com/compliance.pdf',
      surveyorReportUrl: 'https://example.com/report.pdf'
    });

  expect(onboarded.status).toBe('PENDING');

    await assetService.verify(onboarded.id, {
      complianceUrl: 'https://example.com/compliance.pdf',
      surveyorReportUrl: 'https://example.com/report.pdf'
    });

    const tokenization = await assetService.tokenize(onboarded.id, {
      pricePerShareUsd: 1,
      decimals: 2
    });

    expect(tokenization.hederaTokenId).toBe('0.0.9999');
    const refreshed = await prisma.asset.findUnique({ where: { id: onboarded.id } });
    expect(refreshed?.status).toBe('TOKENIZED');
  });
});
