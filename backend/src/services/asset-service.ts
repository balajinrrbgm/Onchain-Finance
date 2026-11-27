import { assetRepository } from '../repositories/asset-repository';
import {
  AssetOnboardingInput,
  assetVerificationSchema,
  tokenizeAssetSchema
} from '../domain/schemas';
import { createFractionalToken } from '../utils/hedera-client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const assetService = {
  onboard: (input: AssetOnboardingInput) => assetRepository.create(input),
  verify: async (assetId: string, payload: unknown) => {
    const parsed = assetVerificationSchema.parse(payload);
    const asset = await assetRepository.verify(assetId, parsed);
    logger.info({ assetId }, 'Asset verified');
    return asset;
  },
  tokenize: async (assetId: string, payload: unknown) => {
    const parsed = tokenizeAssetSchema.parse(payload);
    const asset = await assetRepository.findById(assetId);

    if (!asset) {
      throw new Error('Asset not found');
    }

    if (asset.status !== 'VERIFIED') {
      throw new Error('Asset must be verified before tokenization');
    }

    if (asset.tokenization) {
      return asset.tokenization;
    }

    const totalShares = asset.fractionalGoal;
    const treasuryAccount = parsed.treasuryAccountId ?? env.stablecoinTreasury ?? env.hederaAccountId;

    if (!treasuryAccount) {
      throw new Error('Treasury account required for tokenization');
    }

    const tokenId = await createFractionalToken({
      name: asset.name,
      symbol: `${asset.name.substring(0, 3).toUpperCase()}-${assetId.slice(0, 4)}`,
      decimals: parsed.decimals,
      initialSupply: totalShares,
      treasuryAccountId: treasuryAccount,
      memo: parsed.memo
    });

    const record = await assetRepository.saveTokenization(assetId, {
      hederaTokenId: tokenId,
      totalShares,
      pricePerShareUsd: parsed.pricePerShareUsd,
      treasuryAccount
    });

  await assetRepository.updateStatus(assetId, 'TOKENIZED');
    logger.info({ assetId, tokenId }, 'Asset tokenized');
    return record;
  },
  list: () => assetRepository.list({ status: 'TOKENIZED' })
};
