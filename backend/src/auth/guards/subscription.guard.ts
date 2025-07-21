import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_FREE_KEY } from '../decorators/is-free.decorator';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isFree = this.reflector.getAllAndOverride<boolean>(IS_FREE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isFree) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has a valid subscription
    if (!user.hasSubscription) {
      // console.log(user);
      throw new UnauthorizedException('A valid subscription is required.');
    }

    return true;
  }
}
