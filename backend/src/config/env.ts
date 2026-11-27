import dotenv from 'dotenv';

dotenv.config();

const ensure = (value: string | undefined, fallback?: string) => {
  if (value) {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error('Missing required environment variable');
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  hederaAccountId: process.env.HEDERA_ACCOUNT_ID,
  hederaPrivateKey: process.env.HEDERA_PRIVATE_KEY,
  mirrorNodeUrl: process.env.HEDERA_MIRROR_NODE_URL ?? 'https://testnet.mirrornode.hedera.com',
  stablecoinTreasury: process.env.STABLECOIN_TREASURY_ACCOUNT_ID,
  schema: ensure(process.env.DATABASE_URL, 'file:./dev.db')
};
