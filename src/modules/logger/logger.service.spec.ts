import { Logger } from '@nestjs/common';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = new LoggerService();
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  describe('log', () => {
    it('should log a message with title', () => {
      const consoleLogSpy = jest
        .spyOn(Logger, 'log')
        .mockImplementation(() => {});

      const message = { data: 'test data' };
      const title = 'Info';

      loggerService.log(message, title);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        `${title} ` + JSON.stringify(message),
      );
      consoleLogSpy.mockRestore();
    });

    it('should log a message without title', () => {
      const consoleLogSpy = jest
        .spyOn(Logger, 'log')
        .mockImplementation(() => {});

      const message = { data: 'test data' };

      loggerService.log(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(' ' + JSON.stringify(message));
      consoleLogSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('should warn a message with title', () => {
      const consoleWarnSpy = jest
        .spyOn(Logger, 'warn')
        .mockImplementation(() => {});

      const message = 'test warning';
      const title = 'Warning';

      loggerService.warn(message, title);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `${title} ` + JSON.stringify(message),
      );
      consoleWarnSpy.mockRestore();
    });

    it('should warn a message without title', () => {
      const consoleWarnSpy = jest
        .spyOn(Logger, 'warn')
        .mockImplementation(() => {});

      const message = 'test warning';

      loggerService.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        ' ' + JSON.stringify(message),
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('should error a message with title and trace', () => {
      const consoleErrorSpy = jest
        .spyOn(Logger, 'error')
        .mockImplementation(() => {});

      const message = 'test error';
      const title = 'Error';
      const trace = 'stack trace';

      loggerService.error(message, title, trace);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `${title} ` + message,
        trace,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should error a message without title', () => {
      const consoleErrorSpy = jest
        .spyOn(Logger, 'error')
        .mockImplementation(() => {});

      const message = 'test error';

      loggerService.error(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(' ' + message, undefined);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('debug', () => {
    it('should debug a string message with title', () => {
      const consoleDebugSpy = jest
        .spyOn(Logger, 'debug')
        .mockImplementation(() => {});

      const message = 'debug message';
      const title = 'Debug';

      loggerService.debug(message, title);

      expect(consoleDebugSpy).toHaveBeenCalledWith(`${title} ` + message);
      consoleDebugSpy.mockRestore();
    });

    it('should debug an object message with title', () => {
      const consoleDebugSpy = jest
        .spyOn(Logger, 'debug')
        .mockImplementation(() => {});

      const message = { data: 'test data' };
      const title = 'Debug';

      loggerService.debug(message, title);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        `${title} ` + JSON.stringify(message),
      );
      consoleDebugSpy.mockRestore();
    });

    it('should debug a string message without title', () => {
      const consoleDebugSpy = jest
        .spyOn(Logger, 'debug')
        .mockImplementation(() => {});

      const message = 'debug message';

      loggerService.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalledWith(' ' + message);
      consoleDebugSpy.mockRestore();
    });

    it('should debug an object message without title', () => {
      const consoleDebugSpy = jest
        .spyOn(Logger, 'debug')
        .mockImplementation(() => {});

      const message = { data: 'test data' };

      loggerService.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        ' ' + JSON.stringify(message),
      );
      consoleDebugSpy.mockRestore();
    });
  });
});
