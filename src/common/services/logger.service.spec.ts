import { Logger } from './logger.service';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { LoggerMock } from './logger.service.mock';

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
    TestBed.configureTestingModule({ providers });
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
