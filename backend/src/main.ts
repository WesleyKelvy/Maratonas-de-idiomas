import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AuthenticatedSocketAdapter } from 'src/auth/adapter/authenticated-socket.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro se campos extras forem enviados
      transform: true, // Converte tipos (ex: string para Date, number, etc)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
