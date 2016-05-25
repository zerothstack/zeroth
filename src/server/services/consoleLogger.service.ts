import { LoggerService, LogLevel } from './logger.service';
import { yellow, red, bgRed, magenta, gray, blue, bgYellow, white } from 'chalk';
export class ConsoleLoggerService extends LoggerService {

  public format(logLevel: LogLevel, message: string, args: any[]) {
    message = super.format(logLevel, message, args);
    switch (logLevel) {
      case 'emergency':
        message = bgRed.underline(message);
        break;
      case 'alert':
        message = red.underline(message);
        break;
      case 'critical':
        message = bgYellow(message);
        break;
      case 'warning':
        message = yellow(message);
        break;
      case 'notice':
        message = magenta(message);
        break;
      case 'info':
        message = blue(message);
        break;
      case 'debug':
        message = gray(message);
        break;
    }

    return message;
  }

  public persistLog(logLevel: LogLevel, message: string): Promise<this> | this {

    message = white('[' + gray(new Date().toISOString()) + '] ') + message;

    switch (logLevel) {
      case 'emergency':
      case 'alert':
      case 'critical':
      case 'error':
        console.error(message);
        break;
      case 'warning':
      case 'notice':
        console.warn(message);
        break;
      default:
        console.log(message);
    }
    return this;
  };

}
