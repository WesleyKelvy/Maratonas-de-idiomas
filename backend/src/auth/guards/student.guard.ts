import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_STUDENT } from 'src/auth/decorators/is-student.decorator';

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isStudent = this.reflector.getAllAndOverride<boolean>(IS_STUDENT, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isStudent) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has a valid subscription
    if (user.role !== 'Student') {
      throw new UnauthorizedException('Access blocked');
    }

    return true;
  }
}
