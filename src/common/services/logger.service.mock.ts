import { Logger, LogLevel } from './logger.service';
import { Injectable } from '@angular/core';
import { Service } from '../registry/decorators';

@Injectable()
@Service()
export class LoggerMock extends Logger {

  constructor() {
    super(LoggerMock);
  }

  public persistLog(logLevel: LogLevel, messages: any[]): this {
    return this;
  }

}
