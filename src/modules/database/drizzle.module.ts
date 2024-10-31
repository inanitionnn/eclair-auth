import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { AppConfigType } from '../../shared/types';

export const PG_CONNECTION = 'PG_CONNECTION';

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AppConfigType>) =>
        drizzle(config.get('postgres')),
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
