import * as process from 'process';

import { EnvironmentEnum } from '../enums';
import { AppConfigType } from '../types';

export default (): AppConfigType => ({
  environment: process.env.ENVIRONMENT || EnvironmentEnum.Development,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: process.env.DATABASE_URL!,
});