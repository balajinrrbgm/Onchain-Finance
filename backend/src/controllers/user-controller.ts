import type { Request, Response } from 'express';
import { createUserSchema } from '../domain/schemas';
import { userService } from '../services/user-service';

export const registerUser = async (req: Request, res: Response) => {
  const payload = createUserSchema.parse(req.body);
  const user = await userService.register(payload);
  res.status(201).json(user);
};

export const getProfile = async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};
