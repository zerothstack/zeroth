import { Logger, LogLevel } from './logger.service';
import { Injectable } from '@angular/core';
import { inject, addProviders } from '@angular/core/testing';
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

@Injectable()
class TestClass {

  constructor(public logger: Logger) {

  }

}

const providers = [
  TestClass,
  {provide: Logger, useClass: LoggerMock},
];

describe('Logger mock', () => {

  beforeEach(() => {
    addProviders(providers);
  });

  it('Can be injected with the Logger token', inject([TestClass], (c: TestClass) => {

    let consoleSpy = spyOn(console, 'log');

    expect(c instanceof TestClass)
      .toBe(true);
    expect(c.logger instanceof Logger)
      .toBe(true);
    expect(c.logger instanceof LoggerMock)
      .toBe(true);
    expect(c.logger.debug() instanceof Logger)
      .toBe(true);
    expect(consoleSpy)
      .not
      .toHaveBeenCalled();

  }));
});
