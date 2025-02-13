import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que NÃO estão no DTO
      forbidNonWhitelisted: true, // sobe um erro quando a chave não existir
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
