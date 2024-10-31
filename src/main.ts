import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { EnvironmentEnum } from './shared/enums';
import { swaggerConfig } from './shared/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from './shared/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get<ConfigService, AppConfigType>(ConfigService);

  // Swagger
  if (configService.environment === EnvironmentEnum.Development) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      whitelist: true,
    }),
  );

  const port = configService.port || 3000;

  await app.listen(port);
}
bootstrap();
