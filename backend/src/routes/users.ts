import { Router } from 'express';
import { getProfile, registerUser } from '../controllers/user-controller';

export const userRouter = Router();

userRouter.post('/', registerUser);
userRouter.get('/:id', getProfile);
