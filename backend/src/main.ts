import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AuthenticatedSocketAdapter } from 'src/auth/adapter/authenticated-socket.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS para permitir requests do frontend
  app.enableCors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true, // Importante para cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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
