import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MailerModule } from './mailer/mailer.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { StatsModule } from './stats/stats.module';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { LanguageMarathonModule } from 'src/LanguageMarathon/language-marathon.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    MailerModule,
    StatsModule,
    ClassroomModule,
    LanguageMarathonModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
