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
 * Abstract Logger class that should be used as the DI token for any logging. The implementation
 * should be defined by the provider definition
 *
 * Example
 *
 * main.ts
 * ```typescript
 *   let providers: ProviderDefinition[] = [
 *     {provide: Logger, useClass: ConsoleLogger},
 *   ];
 * ```
 * someService.service.ts
 * ```typescript
 *   @Injectable()
 *   @Service()
 *   export class SomeService extends AbstractService {
 *     constructor(protected logger: Logger) {
 *       logger.source('Some Service').debug('constructor initialized')
 *     }
 *   }
 * ```
 *
 */
@Injectable()
export abstract class Logger extends AbstractService {

  protected sourceName: string;

  constructor(protected impl: LoggerConstructor<any>) {
    super();
  }

  /**
   * Log emergency message(s) to the log output
   *
   * Example:
   * ```typescript
   * try {
   *   // something that might throw Error
   * catch(e){
   *   logger.emergency(e.message).debug(e.stack);
   * }
   * ```
   * @param args
   * @returns {Logger}
   */
  public emergency(...args: any[]): this {
    return this.log('emergency', ...args);
  }

  /**
   * Log alert message(s) to the log output
   * @param args
   * @returns {any}
   */
  public alert(...args: any[]): this {
    return this.log('alert', ...args);
  }

  /**
   * Log critical message(s) to the log output
   * @param args
   * @returns {any}
   */
  public critical(...args: any[]): this {
    return this.log('critical', ...args);
  }

  /**
   * Log error message(s) to the log output
   * @param args
   * @returns {any}
   */
  public error(...args: any[]): this {
    return this.log('error', ...args);
  }

  /**
   * Log warning message(s) to the log output
   * @param args
   * @returns {any}
   */
  public warning(...args: any[]): this {
    return this.log('warning', ...args);
  }

  /**
   * Log notice message(s) to the log output
   * @param args
   * @returns {any}
   */
  public notice(...args: any[]): this {
    return this.log('notice', ...args);
  }

  /**
   * Log info message(s) to the log output
   * @param args
   * @returns {any}
   */
  public info(...args: any[]): this {
    return this.log('info', ...args);
  }

  /**
   * Log debug message(s) to the log output
   * @param args
   * @returns {Logger}
   */
  public debug(...args: any[]): this {
    return this.log('debug', ...args);
  }

  /**
   * Given the log level and list of messages, invoke the persist log method.
   * @param logLevel
   * @param messages
   * @returns {Logger}
   */
  protected log(logLevel: LogLevel, ...messages: any[]): this {
    return this.persistLog(logLevel, messages);
  }

  /**
   * Set a string to denote the source of the log. The effect this has on the log output is up
   * to the implementing class.
   * @param sourceName
   * @returns {Logger}
   */
  protected setSource(sourceName: string): this {
    this.sourceName = sourceName;
    return this;
  }

  /**
   * Creates a new instance of the logger class with the source set. This allows the use of
   * passing around log instances to avoid having to set source each time.
   *
   * Example:
   *
   * example.service.ts
   * ```typescript
   * export class ExampleService extends AbstractService {
   *   protected logger: Logger;
   *   constructor(loggerBase:Logger){
   *     this.logger = loggerBase.source(this.constructor.name);
   *   }
   *
   *   public logExample():void {
   *     this.logger.info('Log message');
   *   }
   * ```
   *
   * When the `(new ExampleService).logExample()` method is called, the logger implementation will
   * have the source defined as `ExampleService`.
   * @param source
   * @returns {any}
   */
  public source(source: string): Logger {
    return new this.impl().setSource(source);
  }

  /**
   * Outputs the log message(s) to the implementation's destination.
   *
   * For example if the implementation is a Loggly logger, it should post the logs to Loggly.
   * @param logLevel
   * @param messages
   */
  public abstract persistLog(logLevel: LogLevel, messages: any[]): this;

}
