import * as util from 'util';
/**
 * Syslog Levels
 * @see http://tools.ietf.org/html/rfc5424
 */
export type LogLevel = 'emergency'
  | 'alert'
  | 'critical'
  | 'error'
  | 'warning'
  | 'notice'
  | 'info'
  | 'debug';


export abstract class LoggerService {

  public emergency(message: string, ...args: any[]): Promise<this> | this {
    return this.log('emergency', message, ...args);
  }

  public alert(message: string, ...args: any[]): Promise<this> | this {
    return this.log('alert', message, ...args);
  }

  public critical(message: string, ...args: any[]): Promise<this> | this {
    return this.log('critical', message, ...args);
  }

  public error(message: string, ...args: any[]): Promise<this> | this {
    return this.log('error', message, ...args);
  }

  public warning(message: string, ...args: any[]): Promise<this> | this {
    return this.log('warning', message, ...args);
  }

  public notice(message: string, ...args: any[]): Promise<this> | this {
    return this.log('notice', message, ...args);
  }

  public info(message: string, ...args: any[]): Promise<this> | this {
    return this.log('info', message, ...args);
  }

  public debug(message: string, ...args: any[]): Promise<this> | this {
    return this.log('debug', message, ...args);
  }

  public log(logLevel: LogLevel, message: string, ...args: any[]): Promise<this> | this {
    message = this.format(logLevel, message, args);

    return this.persistLog(logLevel, message);
  }

  public format(logLevel: LogLevel, message: string, args: any[]) {
    if (args.length) {
      message = util.format(message, ...args);
    }
    return message;
  }

  public abstract persistLog(logLevel: LogLevel, message: string): Promise<this> | this;

}
