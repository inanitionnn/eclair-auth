export interface ILogger {
  warn(message: string, title: string): void;
  log(message: string, title: string): void;
  error(message: string, title?: string): void;
  debug(message: string, title: string): void;
}
