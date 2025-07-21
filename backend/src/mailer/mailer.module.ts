import { Module } from '@nestjs/common';
import { BuildMailerService } from './buildMailer.service';
import { EmailService } from './emailService.service';

@Module({
  providers: [BuildMailerService, EmailService],
  exports: [EmailService],
})
export class MailerModule {}
