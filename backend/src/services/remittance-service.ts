import { v4 as uuid } from 'uuid';
import { remittanceSchema } from '../domain/schemas';
import { remittanceRepository } from '../repositories/remittance-repository';
import { env } from '../config/env';
import { transferStablecoin } from '../utils/hedera-transfer';
import { logger } from '../config/logger';

export const remittanceService = {
  send: async (payload: unknown) => {
    const parsed = remittanceSchema.parse(payload);

    let hedraTransactionId: string | undefined;
    if (env.stablecoinTreasury && parsed.receiverAccountId) {
      try {
        hedraTransactionId = await transferStablecoin({
          tokenId: env.stablecoinTreasury,
          senderAccountId: env.hederaAccountId ?? env.stablecoinTreasury,
          receiverAccountId: parsed.receiverAccountId,
          amount: Math.round(parsed.amount * 100)
        });
      } catch (error) {
        logger.warn({ error }, 'Falling back to simulated remittance');
      }
    }

    if (!hedraTransactionId) {
      hedraTransactionId = `sim-${uuid()}`;
    }

    const record = await remittanceRepository.create({ ...parsed, hedraTransactionId });
    logger.info({ remittanceId: record.id }, 'Remittance processed');
    return record;
  }
};
