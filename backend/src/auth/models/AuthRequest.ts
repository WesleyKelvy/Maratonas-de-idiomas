import { Request } from 'express';
import { User } from '../../User/entities/user.entity';

export interface AuthRequest extends Request {
  user: User;
}
