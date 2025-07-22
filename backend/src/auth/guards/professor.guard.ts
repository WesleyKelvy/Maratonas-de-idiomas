import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PROFESSOR } from '../decorators/is-professor.decorator';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isProfessor = this.reflector.getAllAndOverride<boolean>(
      IS_PROFESSOR,
      [context.getHandler(), context.getClass()],
    );

    if (isProfessor) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has a valid subscription
    if (user.role === 'Student') {
      // console.log(user);
      throw new UnauthorizedException('Access blocked');
    }

    return true;
  }
}
