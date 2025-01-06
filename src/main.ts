import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: `${process.env.CORS_ORIGIN || 'https://slark-ems-frontend.vercel.app'}`, // Allowed frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed
    credentials: true, // Allow cookies and authorization headers
    // Continue with OPTIONS request
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
