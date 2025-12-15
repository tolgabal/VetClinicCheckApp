import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Gelen isteklerdeki kuralları DTO'lara göre doğrulamak için
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
