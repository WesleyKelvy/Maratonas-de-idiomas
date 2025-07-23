import { Module } from '@nestjs/common';
import { PrismaAbstractUserRepository } from 'src/repositories/prisma/prisma-user.repository';
import { MailerModule } from '../mailer/mailer.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { USER_REPOSITORY_TOKEN } from 'src/repositories/abstract/user.repository';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [PrismaModule, MailerModule, StatsModule],
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
