import { DynamicModule, Module } from '@nestjs/common';
import { LoggerOptions } from 'winston';

import { NESTJS_WINSTON_CONFIG_OPTIONS } from './winston.const';
import { WinstonLoggerService } from './winston-logger.service';

@Module({})
export class WinstonLoggerModule {
  static register(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonLoggerModule,
      providers: [
        {
          provide: NESTJS_WINSTON_CONFIG_OPTIONS,
          useValue: options,
        },
        {
          provide: WinstonLoggerService,
          useClass: WinstonLoggerService,
        },
      ],
      exports: [WinstonLoggerService],
    };
  }
}
