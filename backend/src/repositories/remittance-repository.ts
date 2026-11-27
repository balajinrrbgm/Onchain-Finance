import { z } from 'zod';
import { prisma } from '../services/prisma';
import { remittanceSchema } from '../domain/schemas';

type RemittanceInput = z.infer<typeof remittanceSchema> & { hedraTransactionId?: string };

export const remittanceRepository = {
  create: (input: RemittanceInput) =>
    prisma.remittance.create({
      data: {
        senderId: input.senderId,
        receiverPhone: input.receiverPhone,
        amount: input.amount,
        currency: input.currency,
        mobileMoneyProvider: input.mobileMoneyProvider,
        hedraTransactionId: input.hedraTransactionId,
        status: 'SUCCESS'
      }
    }),
  listBySender: (senderId: string) => prisma.remittance.findMany({ where: { senderId } })
};
