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

export interface LoggerConstructor<T extends Logger> {
  new (): T;
}

export abstract class Logger {

  protected sourceName: string;

  constructor(protected impl: LoggerConstructor<any>) {

  }

  public emergency(...args: any[]): Promise<this> | this {
    return this.log('emergency', ...args);
  }

  public alert(...args: any[]): Promise<this> | this {
    return this.log('alert', ...args);
  }

  public critical(...args: any[]): Promise<this> | this {
    return this.log('critical', ...args);
  }

  public error(...args: any[]): Promise<this> | this {
    return this.log('error', ...args);
  }

  public warning(...args: any[]): Promise<this> | this {
    return this.log('warning', ...args);
  }

  public notice(...args: any[]): Promise<this> | this {
    return this.log('notice', ...args);
  }

  public info(...args: any[]): Promise<this> | this {
    return this.log('info', ...args);
  }

  public debug(...args: any[]): Promise<this> | this {
    return this.log('debug', ...args);
  }

  public log(logLevel: LogLevel, ...args: any[]): Promise<this> | this {
    return this.persistLog(logLevel, args);
  }

  protected setSource(sourceName: string): this {
    this.sourceName = sourceName;
    return this;
  }

  public source(source: string): Logger {
    return new this.impl().setSource(source);
  }

  public abstract persistLog(logLevel: LogLevel, messages: any[]): Promise<this> | this;

}
