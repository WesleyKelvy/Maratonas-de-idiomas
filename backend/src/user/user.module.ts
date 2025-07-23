import { Module } from '@nestjs/common';
import { PrismaAbstractUserRepository } from 'src/repositories/prisma/prisma-user.repository';
import { MailerModule } from '../mailer/mailer.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { USER_REPOSITORY_TOKEN, UserService } from './user.service';

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaAbstractUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY_TOKEN],
})
export class UserModule {}
