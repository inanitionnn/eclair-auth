import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid';

import { ILogger } from './logger.interface';
import { LoggerSymbol } from './winston/winston.const';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(LoggerSymbol) protected logger: ILogger) {}

  use(req: Request & { guid?: string }, res: Response, next: NextFunction) {
    req.guid = uuid.v4();

    const method = () => req.method;
    const url = () => req.originalUrl;
    const params = () => req.params || '-';
    const body = () => req.body || '-';

    const message = {
      url: `${method()} ${url()}\n`,
      params: `${JSON.stringify(params())}\n`,
      body: `${JSON.stringify(body())}\n`,
    };

    this.logger.log(`[${req.guid}]: ${JSON.stringify(message)}`, 'Request');

    return next();
  }
}
