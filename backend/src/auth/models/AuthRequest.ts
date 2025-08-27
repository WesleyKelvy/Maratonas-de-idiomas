import { Request } from 'express';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

export interface AuthRequest extends Request {
  user: UserFromJwt;
}
