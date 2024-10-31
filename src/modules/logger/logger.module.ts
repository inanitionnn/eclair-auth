import 'winston-daily-rotate-file';

import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as winston from 'winston';

import { LoggerService } from './logger.service';
import { LoggerSymbol } from './winston/winston.const';
import { WinstonLoggerModule } from './winston/winston-logger.module';
import { WinstonLoggerService } from './winston/winston-logger.service';
import { EnvironmentEnum } from '../../shared/enums';

@Module({})
export class LoggerModule {
  static register(): DynamicModule {
    let provider: Provider<any>;
    if (process.env.NODE_ENV === EnvironmentEnum.Development) {
      provider = {
        provide: LoggerSymbol,
        useClass: LoggerService,
      };
    } else {
      provider = {
        provide: LoggerSymbol,
        useExisting: WinstonLoggerService,
      };
    }
    return {
      module: LoggerModule,
      imports: [
        WinstonLoggerModule.register({
          transports: [
            new winston.transports.DailyRotateFile({
              filename: 'application-%DATE%.log',
              dirname: 'logs/',
              level: 'info',
              handleExceptions: true,
              json: true,
              zippedArchive: true,
              datePattern: 'YYYY-MM-DD',
              maxFiles: '14d',
            }),
          ],
        }),
      ],
      providers: [provider],
      exports: [LoggerSymbol],
      global: true,
    };
  }
}
