import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Every route lives under /api, e.g. http://localhost:3000/api/todos
  app.setGlobalPrefix('api');
  // Empty title or unknown status → 400. whitelist drops fields the DTO doesn't declare.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // React runs on :5173, a different origin, so the browser needs permission.
  app.enableCors({ origin: 'http://localhost:5173' });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
