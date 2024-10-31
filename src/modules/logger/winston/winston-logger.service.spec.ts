import { Test, TestingModule } from '@nestjs/testing';
import { createLogger } from 'winston';
import { WinstonLoggerService } from './winston-logger.service';
import { NESTJS_WINSTON_CONFIG_OPTIONS } from './winston.const';

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  Logger: jest.fn(),
}));

describe('WinstonLoggerService', () => {
  let loggerService: WinstonLoggerService;
  let mockLogger: any;

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    (createLogger as jest.Mock).mockReturnValue(mockLogger);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinstonLoggerService,
        {
          provide: NESTJS_WINSTON_CONFIG_OPTIONS,
          useValue: {}, // Provide mock configuration options here
        },
      ],
    }).compile();

    loggerService = module.get<WinstonLoggerService>(WinstonLoggerService);
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  describe('log', () => {
    it('should log a message with title', () => {
      const message = 'test message';
      const title = 'Info';

      loggerService.log(message, title);

      expect(mockLogger.info).toHaveBeenCalledWith(`${title} ` + message);
    });

    it('should log a message without title', () => {
      const message = 'test message';

      loggerService.log(message);

      expect(mockLogger.info).toHaveBeenCalledWith(' ' + message);
    });
  });

  describe('warn', () => {
    it('should warn a message with title', () => {
      const message = 'test warning';
      const title = 'Warning';

      loggerService.warn(message, title);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        `${title} ` + JSON.stringify(message),
      );
    });

    it('should warn a message without title', () => {
      const message = 'test warning';

      loggerService.warn(message);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        ' ' + JSON.stringify(message),
      );
    });
  });

  describe('error', () => {
    it('should error a message with title and trace', () => {
      const message = 'test error';
      const title = 'Error';
      const trace = 'stack trace';

      loggerService.error(message, title, trace);

      expect(mockLogger.error).toHaveBeenCalledWith(
        `${title} ` + message,
        trace,
      );
    });

    it('should error a message without title', () => {
      const message = 'test error';

      loggerService.error(message);

      expect(mockLogger.error).toHaveBeenCalledWith(' ' + message, undefined);
    });
  });

  describe('debug', () => {
    it('should debug a string message with title', () => {
      const message = 'debug message';
      const title = 'Debug';

      loggerService.debug(message, title);

      expect(mockLogger.debug).toHaveBeenCalledWith(`${title} ` + message);
    });

    it('should debug an object message with title', () => {
      const message = { data: 'test data' };
      const title = 'Debug';

      loggerService.debug(message, title);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        `${title} ` + JSON.stringify(message),
      );
    });

    it('should debug a string message without title', () => {
      const message = 'debug message';

      loggerService.debug(message);

      expect(mockLogger.debug).toHaveBeenCalledWith(' ' + message);
    });

    it('should debug an object message without title', () => {
      const message = { data: 'test data' };

      loggerService.debug(message);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        ' ' + JSON.stringify(message),
      );
    });
  });
});
