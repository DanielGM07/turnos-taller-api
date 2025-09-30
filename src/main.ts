import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// (Opcional) Swagger básico sin dependencias externas
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Seguridad y CORS
  app.use(helmet());
  app.enableCors();

  // Prefijo global
  app.setGlobalPrefix('/api');

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger básico (si querés desactivarlo, comentá este bloque)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TallerExpress API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('workshop')
    .build();
  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, doc);

  // Port desde .env
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Server running at http://localhost:${port}/api`);
  console.log(`Swagger available at http://localhost:${port}/api/docs`);
}
bootstrap();
