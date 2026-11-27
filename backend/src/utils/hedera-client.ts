import {
  Client,
  Hbar,
  PrivateKey,
  TokenCreateTransaction,
  TokenSupplyType,
  TokenType
} from '@hashgraph/sdk';
import { env } from '../config/env';
import { logger } from '../config/logger';

let cachedClient: Client | null = null;

export const getHederaClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  if (!env.hederaAccountId || !env.hederaPrivateKey) {
    throw new Error('Missing Hedera operator credentials');
  }

  const client = Client.forTestnet();
  client.setOperator(env.hederaAccountId, PrivateKey.fromString(env.hederaPrivateKey));
  cachedClient = client;
  return client;
};

export const resetHederaClient = () => {
  cachedClient = null;
};

interface CreateFractionalTokenInput {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  treasuryAccountId: string;
  memo?: string;
}

export const createFractionalToken = async (input: CreateFractionalTokenInput) => {
  const client = getHederaClient();
  const operatorPublicKey = client.operatorPublicKey;

  if (!operatorPublicKey) {
    throw new Error('Hedera operator public key unavailable');
  }

  const tx = new TokenCreateTransaction()
    .setTokenName(input.name)
    .setTokenSymbol(input.symbol)
    .setTokenMemo(input.memo ?? 'AfriAsset RWA token')
    .setDecimals(input.decimals)
    .setTreasuryAccountId(input.treasuryAccountId)
    .setInitialSupply(input.initialSupply)
    .setSupplyType(TokenSupplyType.Infinite)
  .setTokenType(TokenType.FungibleCommon)
  .setAdminKey(operatorPublicKey)
    .setFreezeDefault(false)
    .setMaxTransactionFee(new Hbar(20));

  const submitResponse = await tx.execute(client);
  const receipt = await submitResponse.getReceipt(client);

  if (!receipt.tokenId) {
    logger.error({ receipt }, 'Failed to create token on Hedera');
    throw new Error('Token creation failed');
  }

  return receipt.tokenId.toString();
};
