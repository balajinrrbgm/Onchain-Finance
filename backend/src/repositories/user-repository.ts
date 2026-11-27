import { CreateUserInput } from '../domain/schemas';
import { prisma } from '../services/prisma';

export const userRepository = {
  create: (input: CreateUserInput) =>
    prisma.user.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        role: input.role,
        country: input.country,
        hederaAccountId: input.hederaAccountId
      }
    }),
  findByPhone: (phone: string) => prisma.user.findUnique({ where: { phone } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  listInvestors: () => prisma.user.findMany({ where: { role: 'INVESTOR' } })
};
