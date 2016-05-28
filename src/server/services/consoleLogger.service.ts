import { Logger, LogLevel } from './logger.service';
import { yellow, red, bgRed, magenta, gray, blue, bgYellow } from 'chalk';
import { inspect } from 'util';
import * as moment from 'moment';
export class ConsoleLogger extends Logger {

  constructor() {
    super(ConsoleLogger);
  }

  public format(logLevel: LogLevel, message: string) {
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

  private formatMessages(logLevel: LogLevel, messages: any[]): any[] {
    return messages.map((message) => {
      switch (typeof message) {
        case 'string' :
          return this.format(logLevel, message);
        default:
          return inspect(message, {
            colors: true
          });
      }
    });
  }

  public persistLog(logLevel: LogLevel, messages: any[]): this {

    messages = this.formatMessages(logLevel, messages);

    if (this.sourceName) {
      messages.unshift(gray('[' + this.format(logLevel, this.sourceName) + ']'));
    }

    messages.unshift( gray('[' + this.format(logLevel, moment().format('HH:mm:ss')) + '] '));

    switch (logLevel) {
      case 'emergency':
      case 'alert':
      case 'critical':
      case 'error':
        console.error(messages.shift(), ...messages);
        break;
      case 'warning':
      case 'notice':
        console.warn(messages.shift(), ...messages);
        break;
      default:
        console.log(messages.shift(), ...messages);
    }
    return this;
  };

}
