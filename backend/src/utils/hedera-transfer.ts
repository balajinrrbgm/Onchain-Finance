import { AccountId, TokenId, TransferTransaction } from '@hashgraph/sdk';
import { getHederaClient } from './hedera-client';
import { logger } from '../config/logger';

interface StablecoinTransferInput {
  tokenId: string;
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
}

export const transferStablecoin = async (input: StablecoinTransferInput) => {
  const client = getHederaClient();
  const token = TokenId.fromString(input.tokenId);
  const sender = AccountId.fromString(input.senderAccountId);
  const receiver = AccountId.fromString(input.receiverAccountId);

  const tx = await new TransferTransaction()
    .addTokenTransfer(token, sender, -input.amount)
    .addTokenTransfer(token, receiver, input.amount)
    .freezeWith(client)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  logger.debug({ transactionId: tx.transactionId?.toString(), receipt }, 'Stablecoin transfer submitted');
  return tx.transactionId?.toString();
};
