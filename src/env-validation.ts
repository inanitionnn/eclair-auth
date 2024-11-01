import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { EnvironmentEnum } from './shared/enums';

class EnvironmentVariables {
  @IsEnum(EnvironmentEnum)
  ENVIRONMENT: EnvironmentEnum;

  @IsNumber()
  PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_PORT: string;

  @IsString()
  POSTGRES_HOST: string;

  @IsString()
  POSTGRES_NAME: string;

  @IsString()
  REDIS_HOST: string;

  @IsString()
  REDIS_PORT: string;

  @IsString()
  JWT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
