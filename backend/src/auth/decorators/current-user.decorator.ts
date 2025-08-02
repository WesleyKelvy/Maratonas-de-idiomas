import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/User/entities/user.entity';
import { AuthRequest } from '../models/AuthRequest';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// export const CurrentUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext): User => {
//     const request = context.switchToHttp().getRequest<AuthRequest>();

//     return request.user;
//   },
// );
