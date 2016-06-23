import { Logger, LogLevel } from './logger.service';
import { Injectable } from '@angular/core';
import { fit, it, inject, beforeEachProviders, expect, describe } from '@angular/core/testing';

@Injectable()
export class LoggerMock extends Logger {

  constructor() {
    super(LoggerMock);
  }

  public persistLog(logLevel: LogLevel, messages: any[]): this {
    return this;
  }

}

@Injectable()
class TestClass {

  constructor(public logger:Logger){

  }

}


const providers = [
  TestClass,
  {provide: Logger, useClass: LoggerMock},
];

describe('Logger mock', () => {

  beforeEachProviders(() => providers);

  it('Can be injected with the Logger token', inject([TestClass], (c: TestClass) => {

    let consoleSpy = spyOn(console, 'log');

    expect(c instanceof TestClass).toBe(true);
    expect(c.logger instanceof Logger).toBe(true);
    expect(c.logger instanceof LoggerMock).toBe(true);
    expect(c.logger.debug() instanceof Logger).toBe(true);
    expect(consoleSpy).not.toHaveBeenCalled();

  }));
});
