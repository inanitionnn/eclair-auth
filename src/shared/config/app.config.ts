import * as process from 'process';

import { EnvironmentEnum } from '../enums';
import { AppConfigType } from '../types';

export default (): AppConfigType => ({
  environment: process.env.ENVIRONMENT || EnvironmentEnum.Development,
  port: parseInt(process.env.PORT, 10) || 3000,
  postgresUrl: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_NAME}`,
  redisHost: process.env.REDIS_HOST! || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  jwtSecret: process.env.JWT_SECRET!,
});
