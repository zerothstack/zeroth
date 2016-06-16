import { Logger, LogLevel } from './logger.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LoggerMock extends Logger {

  constructor() {
    super(LoggerMock);
  }

  public persistLog(logLevel: LogLevel, messages: any[]): Promise<this>|this {
    return this;
  }

}
