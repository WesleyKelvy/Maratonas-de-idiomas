import { Module } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from 'src/repositories/abstract/user.repository';
import { PrismaAbstractUserRepository } from 'src/repositories/prisma/prisma-user.repository';
import { StatsModule } from 'src/Stats/stats.module';
import { USER_SERVICE_TOKEN } from 'src/User/abstract-services/abstract-user.service';
import { MailerModule } from '../Mailer/mailer.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MailerModule, StatsModule],
  controllers: [UserController],
  providers: [
    { provide: USER_SERVICE_TOKEN, useClass: UserService },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaAbstractUserRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN, USER_SERVICE_TOKEN],
})
export class UserModule {}
