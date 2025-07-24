import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
