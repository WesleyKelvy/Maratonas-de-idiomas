import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/sendEmailDto.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class BuildMailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT || 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail({ html, recipients, from, subject }: SendEmailDto) {
    try {
      // console.log('antes do info: ', html, recipients, from, subject);

      const info: Mail.Options = await this.transporter.sendMail({
        from: `${process.env.APP_NAME} <${process.env.DEFAULT_EMAIL_FROM}>`,
        to: recipients,
        subject,
        html,
      });
      // console.log('apos o info: ', info);

      return info;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

// const options: Mail.Options = {
//   from: dto.from ?? {
//     name: process.env.APP_NAME,
//     address: process.env.DEFAULT_EMAIL_FROM,
//   },
//   to: dto.recipients,
//   subject: dto.subject,
//   html: dto.html,
// };
