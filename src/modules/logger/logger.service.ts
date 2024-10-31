import { Injectable, Logger } from '@nestjs/common';

import { ILogger } from './logger.interface';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  public log(message: any, title = '') {
    Logger.log(`${title} ` + JSON.stringify(message));
  }

  public warn(message: string, title = '') {
    Logger.warn(`${title} ` + JSON.stringify(message));
  }

  public error(message: string, title = '', trace?: string) {
    Logger.error(`${title} ` + message, trace);
  }

  public debug(message: any, title = '') {
    if (typeof message === 'string') {
      Logger.debug(`${title} ` + message);
    }
    Logger.debug(`${title} ` + JSON.stringify(message));
  }
}
