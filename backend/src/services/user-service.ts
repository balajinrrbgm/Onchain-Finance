import { userRepository } from '../repositories/user-repository';
import { CreateUserInput } from '../domain/schemas';
import { logger } from '../config/logger';

export const userService = {
  register: async (input: CreateUserInput) => {
    const existing = await userRepository.findByPhone(input.phone);
    if (existing) {
      return existing;
    }

    const created = await userRepository.create(input);
    logger.info({ userId: created.id }, 'Registered user');
    return created;
  },
  getProfile: (id: string) => userRepository.findById(id)
};
