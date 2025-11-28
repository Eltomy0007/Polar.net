import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '1mb' }));
  await app.listen(3000);
  console.log('Polar.net support server listening on http://localhost:3000');
}
bootstrap();
