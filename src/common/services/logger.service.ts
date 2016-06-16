import { Injectable } from '@angular/core';

const tableModule  = require('table');
const table: Table = tableModule.default;

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

export interface TableBorderTemplate {

  topBody?: string;
  topJoin?: string;
  topLeft?: string;
  topRight?: string;

  bottomBody?: string;
  bottomJoin?: string;
  bottomLeft?: string;
  bottomRight?: string;

  bodyLeft?: string;
  bodyRight?: string;
  bodyJoin?: string;

  joinBody?: string;
  joinLeft?: string;
  joinRight?: string;
  joinJoin?: string;

}
export interface TableBorderTemplateFactory {
  (name: string): TableBorderTemplate;
}

export interface TableConfig {
  columnDefault?: {
    width?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
  columnCount?: number;
  columns?: {
    [key: number]: {
      width?: number;
      minWidth?: number;
      alignment?: 'center' | 'left' | 'right';
      truncate: number;
      wrapWord: boolean;
    };
  };
  border?: TableBorderTemplate | TableBorderTemplateFactory;
  drawHorizontalLine: (index: number, size: number) => boolean;
  drawJoin: () => boolean;
}

export interface Table {
  (data: any[][], config?: TableConfig): string;
}

@Injectable()
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

  public makeTable(data: any[][], config?: TableConfig): string {
    return table(data, config);
  }

}
