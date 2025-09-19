import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Leer CORS_ORIGIN desde .env (pueden ser múltiples separados por coma)
  const corsOrigins = configService.get<string>('CORS_ORIGIN')?.split(',') || [];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  // 🚀 Mensajes al arrancar
  console.log(`Server running on http://localhost:${port}`);
  console.log(`CORS origins allowed: ${corsOrigins.length > 0 ? corsOrigins.join(', ') : 'none'}`);
}
void bootstrap();
