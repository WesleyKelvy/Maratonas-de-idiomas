import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Role } from '@prisma/client';

@Injectable()
export class WsStudentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const user = client.data.user;

    if (!user) {
      throw new WsException('Unauthorized: User not authenticated');
    }

    if (user.role !== Role.Student) {
      throw new WsException('Forbidden: Only students allowed');
    }

    return true;
  }
}
