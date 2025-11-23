import { Injectable } from '@nestjs/common';
import { BuildMailerService } from './buildMailer.service';
import { EmailDto } from './dto/EmailDto.dto';
import { SendEmailDto } from './dto/sendEmailDto.dto';
import { accountCreationTemplate } from './templates/accountCreated.template';
import { resendVerifingCodeTemplate } from './templates/resendVerifingCode.template';
import { accountDeletionTemplate } from './templates/accountDeletion.template';
import { cancelSubscriptionTemplate } from './templates/cancelSubscription.template';
import { passwordResetTemplate } from './templates/passwordReset.template';
import { subscriptionSuccessTemplate } from './templates/subscriptionSuccess.template';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: BuildMailerService) {}

  async sendSubscriptionCancellationEmail({
    email,
    name,
  }: EmailDto): Promise<void> {
    const formattedDate = new Date().toLocaleDateString('pt-BR');

    const data: SendEmailDto = {
      recipients: [{ name: name, address: email }],
      subject: 'Cancelamento de assinatura',
      html: cancelSubscriptionTemplate(
        name,
        process.env.APP_NAME,
        formattedDate,
      ),
    };

    await this.mailerService.sendEmail(data);
  }

  async sendAccountDeletionEmail({ email, name }: EmailDto): Promise<void> {
    const data: SendEmailDto = {
      recipients: [{ name: name, address: email }],
      subject: 'Conta deletada com sucesso',
      html: accountDeletionTemplate(name),
    };
    await this.mailerService.sendEmail(data);
  }

  async sendResetPasswordEmail(
    { email, name }: EmailDto,
    resetUrl: string,
  ): Promise<void> {
    const data: SendEmailDto = {
      recipients: [{ name: name, address: email }],
      subject: 'Redefinir Senha',
      html: passwordResetTemplate(resetUrl),
    };
    await this.mailerService.sendEmail(data);
  }

  async sendAccountCreatedEmail({
    email,
    name,
    code,
  }: EmailDto): Promise<void> {
    const data: SendEmailDto = {
      recipients: [{ name: name, address: email }],
      subject: `Olá, ${name}, sua conta criada! Bem-vindo(a) ao ${process.env.APP_NAME} `,
      html: accountCreationTemplate(name, code),
    };
    await this.mailerService.sendEmail(data);
  }

  async resendVerifingCodeTemplate({
    email,
    name,
    code,
  }: EmailDto): Promise<void> {
    const data: SendEmailDto = {
      recipients: [{ name: name, address: email }],
      subject: `Olá, ${name}! Código para verificação de conta `,
      html: resendVerifingCodeTemplate(name, code, process.env.APP_NAME),
    };
    await this.mailerService.sendEmail(data);
  }

  async subscriptionSuccessEmail({ email, name }: EmailDto): Promise<void> {
    const data: SendEmailDto = {
      recipients: [{ name, address: email }],
      subject: `Olá, ${name}, sua assinatura foi ativada! Equipe ${process.env.APP_NAME}`,
      html: subscriptionSuccessTemplate(name),
    };
    this.mailerService.sendEmail(data);
  }

  // async sendRefundNotificationEmail({
  //   email,
  //   name,
  //   refundAmount,
  // }: EmailDto): Promise<void> {
  //   const data: SendEmailDto = {
  //     recipients: [{ name, address: email }],
  //     subject: `Olá, ${name}, seu pagamento referente a assintura foi reembolsado! Equipe ${process.env.APP_NAME}`,
  //     html: sendRefundNotificationEmail(name, refundAmount),
  //   };
  //   this.mailerService.sendEmail(data);
  // }
}
