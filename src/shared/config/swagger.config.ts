import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Eclair')
  .setDescription('The Eclair API service')
  .setVersion('1.0')
  .build();
