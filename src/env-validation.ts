import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { EnvironmentEnum } from './shared/enums';

class EnvironmentVariables {
  @IsEnum(EnvironmentEnum)
  ENVIRONMENT: EnvironmentEnum;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;
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
