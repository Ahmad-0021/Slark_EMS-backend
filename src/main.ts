import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guard/auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'https://slark-ems-frontend.vercel.app', // Allowed frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed
    credentials: true, // Allow cookies and authorization headers
    preflightContinue: false, // Continue with OPTIONS request
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
