import type { AssetCategory, AssetStatus } from '../domain/constants';
import { AssetOnboardingInput } from '../domain/schemas';
import { prisma } from '../services/prisma';

export const assetRepository = {
  create: (input: AssetOnboardingInput) =>
    prisma.asset.create({
      data: {
        ownerId: input.ownerId,
        name: input.name,
        category: input.category,
        valuationUsd: input.valuationUsd,
        location: input.location,
        fractionalGoal: input.fractionalGoal,
        complianceUrl: input.complianceUrl,
        surveyorReportUrl: input.surveyorReportUrl
      },
      include: { owner: true }
    }),
  findById: (id: string) =>
    prisma.asset.findUnique({
      where: { id },
      include: { tokenization: true, owner: true }
    }),
  updateStatus: (id: string, status: AssetStatus) =>
    prisma.asset.update({ data: { status }, where: { id } }),
  verify: (id: string, urls: { complianceUrl: string; surveyorReportUrl: string }) =>
    prisma.asset.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        complianceUrl: urls.complianceUrl,
        surveyorReportUrl: urls.surveyorReportUrl
      },
      include: { owner: true }
    }),
  saveTokenization: (
    assetId: string,
    payload: { hederaTokenId: string; totalShares: number; pricePerShareUsd: number; treasuryAccount: string }
  ) =>
    prisma.fractionalToken.create({
      data: {
        assetId,
        hederaTokenId: payload.hederaTokenId,
        totalShares: payload.totalShares,
        pricePerShareUsd: payload.pricePerShareUsd,
        treasuryAccount: payload.treasuryAccount
      }
    }),
  list: (filter?: { status?: AssetStatus; category?: AssetCategory }) =>
    prisma.asset.findMany({
      where: {
        status: filter?.status,
        category: filter?.category
      },
      include: { tokenization: true, owner: true }
    })
};
