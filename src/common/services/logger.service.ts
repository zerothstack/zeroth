/**
 * @module common
 */
/** End Typedoc Module Declaration */
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

export type LogVerbosityType = 'silly' | 'verbose' | 'info' | 'error' | 'none';

export enum LogVerbosity {
  none,
  error,
  info,
  verbose,
  silly,
}

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
 * Logger provides methods for all log types defined by
 * [The Syslog Protocol (RFC 5424)](http://tools.ietf.org/html/rfc5424)
 *
 */
@Injectable()
export abstract class Logger extends AbstractService {

  protected sourceName: string;
  protected verbosityLevel: LogVerbosity;

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
    return this.log('emergency', LogVerbosity.error, ...args);
  }

  /**
   * Log alert message(s) to the log output
   * @param args
   * @returns {any}
   */
  public alert(...args: any[]): this {
    return this.log('alert', LogVerbosity.error, ...args);
  }

  /**
   * Log critical message(s) to the log output
   * @param args
   * @returns {any}
   */
  public critical(...args: any[]): this {
    return this.log('critical', LogVerbosity.error, ...args);
  }

  /**
   * Log error message(s) to the log output
   * @param args
   * @returns {any}
   */
  public error(...args: any[]): this {
    return this.log('error', LogVerbosity.error, ...args);
  }

  /**
   * Log warning message(s) to the log output
   * @param args
   * @returns {any}
   */
  public warning(...args: any[]): this {
    return this.log('warning', LogVerbosity.info, ...args);
  }

  /**
   * Log notice message(s) to the log output
   * @param args
   * @returns {any}
   */
  public notice(...args: any[]): this {
    return this.log('notice', LogVerbosity.info, ...args);
  }

  /**
   * Log info message(s) to the log output
   * @param args
   * @returns {any}
   */
  public info(...args: any[]): this {
    return this.log('info', LogVerbosity.info, ...args);
  }

  /**
   * Log debug message(s) to the log output
   * @param args
   * @returns {Logger}
   */
  public debug(...args: any[]): this {
    return this.log('debug', LogVerbosity.verbose, ...args);
  }

  /**
   * Given the log level and list of messages, and if the global verbosity level is satisified,
   * invoke the persist log method.
   * @param logLevel
   * @param verbosity
   * @param messages
   * @returns {any}
   */
  protected log(logLevel: LogLevel, verbosity: LogVerbosity, ...messages: any[]): this {

    this.setVerbosity(verbosity);

    const globalVerbosity: number = LogVerbosity[(process.env.LOG_LEVEL as string)];

    if (typeof globalVerbosity == 'number' && globalVerbosity < this.verbosityLevel) {
      this.setVerbosity(undefined, true);
      return;
    }

    return this.persistLog(logLevel, messages)
      .setVerbosity(undefined, true); //reset the verbosity to undefined for the next log
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
   * Sets the current log verbosity level, used to compare against the global value to determine
   * whether or not to persist the log. If a verbosity is already set, don't force unless requested.
   * to, as
   * @param level
   * @param force
   * @returns {Logger}
   */
  protected setVerbosity(level: LogVerbosity, force: boolean = false): this {
    if (!force && !!this.verbosityLevel) {
      return this;
    }
    this.verbosityLevel = level;
    return this;
  }

  /**
   * Chainable method to allow forcing the log level to only show when log verbosity level is 'silly'
   *
   * Example:
   * ```typescript
   * try {
   *   //do something that throws error
   * } catch (e) {
   *   this.logger.error(e.message).silly.debug(e.stack);
   * }
   * ```
   * This will only log the stack trace if the global `process.env.LOG_LEVEL` is `'silly'`
   * @returns {Logger}
   */
  public get silly() {
    return this.setVerbosity(LogVerbosity.silly, true);
  }

  /**
   * Chainable method to allow forcing the log level to only show when log verbosity level is 'verbose'
   * @returns {Logger}
   */
  public get verbose() {
    return this.setVerbosity(LogVerbosity.verbose, true);
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
