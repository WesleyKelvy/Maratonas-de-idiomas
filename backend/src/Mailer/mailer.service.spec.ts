// import { Test, TestingModule } from '@nestjs/testing';
// import { MailerService } from './mailer.service';
// import * as nodemailer from 'nodemailer';
// import { SendEmailDto } from './dto/mail.dto';

// jest.mock('nodemailer');

// describe('MailerService', () => {
//   let service: MailerService;
//   let transporterMock: jest.Mocked<nodemailer.Transporter>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [MailerService],
//     }).compile();

//     service = module.get<MailerService>(MailerService);

//     transporterMock = {
//       sendMail: jest.fn(),
//     } as unknown as jest.Mocked<nodemailer.Transporter>;

//     (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('sendEmail', () => {
//     it('should send an email successfully', async () => {
//       const mockSendEmailDto: SendEmailDto = {
//         html: '<p>Test email</p>',
//         recipients: [
//           {
//             name: 'recipient',
//             address: 'recipient@example.com',
//           },
//         ],
//         from: { name: 'sender', address: 'sender@example.com' },
//         subject: 'Test Subject',
//       };

//       const mockResponse = {
//         messageId: '123',
//         response: 'OK',
//       };

//       transporterMock.sendMail.mockResolvedValue(mockResponse);

//       const result = await service.sendEmail(mockSendEmailDto);

//       expect(result).toEqual(mockResponse);
//       expect(transporterMock.sendMail).toHaveBeenCalledWith({
//         from: `${process.env.APP_NAME} <${process.env.DEFAULT_EMAIL_FROM}>`,
//         to: mockSendEmailDto.recipients,
//         subject: mockSendEmailDto.subject,
//         html: mockSendEmailDto.html,
//       });
//     });

//     it('should throw an error if email sending fails', async () => {
//       const mockSendEmailDto: SendEmailDto = {
//         html: '<p>Test email</p>',
//         recipients: [
//           {
//             name: 'recipient',
//             address: 'recipient@example.com',
//           },
//         ],
//         from: { name: 'sender', address: 'sender@example.com' },
//         subject: 'Test Subject',
//       };

//       transporterMock.sendMail.mockRejectedValue(
//         new Error('Failed to send email'),
//       );

//       await expect(service.sendEmail(mockSendEmailDto)).rejects.toThrow(
//         'Failed to send email: Failed to send email',
//       );

//       expect(transporterMock.sendMail).toHaveBeenCalledWith({
//         from: `${process.env.APP_NAME} <${process.env.DEFAULT_EMAIL_FROM}>`,
//         to: mockSendEmailDto.recipients,
//         subject: mockSendEmailDto.subject,
//         html: mockSendEmailDto.html,
//       });
//     });
//   });

//   describe('constructor', () => {
//     it('should create a nodemailer transporter with correct configuration', () => {
//       expect(nodemailer.createTransport).toHaveBeenCalledWith({
//         host: process.env.MAIL_HOST,
//         port: +process.env.MAIL_PORT || 587,
//         secure: false,
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASSWORD,
//         },
//       });
//     });
//   });
// });
