import { Injectable } from '@angular/core';
import { AbstractService } from './service';

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

/**
 * Abstract Logger class that should be used as the DI token for any logging.
 * 
 * Example
 * 
 */
@Injectable()
export abstract class Logger extends AbstractService {

  protected sourceName: string;

  constructor(protected impl: LoggerConstructor<any>) {
    super();
  }

  public emergency(...args: any[]): this {
    return this.log('emergency', ...args);
  }

  public alert(...args: any[]): this {
    return this.log('alert', ...args);
  }

  public critical(...args: any[]): this {
    return this.log('critical', ...args);
  }

  public error(...args: any[]): this {
    return this.log('error', ...args);
  }

  public warning(...args: any[]): this {
    return this.log('warning', ...args);
  }

  public notice(...args: any[]): this {
    return this.log('notice', ...args);
  }

  public info(...args: any[]): this {
    return this.log('info', ...args);
  }

  public debug(...args: any[]): this {
    return this.log('debug', ...args);
  }

  public log(logLevel: LogLevel, ...args: any[]): this {
    return this.persistLog(logLevel, args);
  }

  protected setSource(sourceName: string): this {
    this.sourceName = sourceName;
    return this;
  }

  public source(source: string): Logger {
    return new this.impl().setSource(source);
  }

  public abstract persistLog(logLevel: LogLevel, messages: any[]): this;

}
