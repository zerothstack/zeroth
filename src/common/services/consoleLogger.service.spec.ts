import { it, expect, describe} from '@angular/core/testing';
import { ConsoleLogger, isBrowser } from './consoleLogger.service';
import {stripColor, hasColor} from 'chalk';
import Spy = jasmine.Spy;
import { LogLevel } from './logger.service';

describe('Console Logger', () => {

  let logger:ConsoleLogger;
  let consoleLogSpy:Spy;
  let consoleErrorSpy:Spy;
  let consoleWarnSpy:Spy;

  beforeEach(() => {
    logger = new ConsoleLogger();
    consoleLogSpy = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
    consoleWarnSpy = spyOn(console, 'warn');
  });

  afterEach(() => {
    consoleLogSpy.calls.reset();
    consoleErrorSpy.calls.reset();
    consoleWarnSpy.calls.reset();
  });

  it('logs to the console with a timestamp', () => {

    logger.info('example');

    expect(stripColor(consoleLogSpy.calls.first().args[0])).toMatch(/\[\d{2}:\d{2}:\d{2}\]/);
    expect(stripColor(consoleLogSpy.calls.first().args[1])).toEqual('example');
  });

  it('can have a prefix applied', () => {

    logger.source('test').info('message');

    expect(stripColor(consoleLogSpy.calls.first().args[1])).toEqual('[test]');
    expect(stripColor(consoleLogSpy.calls.first().args[2])).toEqual('message');

  });

  it('can syntax highlight passed objects when in node terminal', () => {

    const nodeTerminal = !isBrowser();

    logger.debug({foo:1});

    if (nodeTerminal){
      expect(hasColor(consoleLogSpy.calls.first().args[1])).toBe(true);
      expect(stripColor(consoleLogSpy.calls.first().args[1])).toEqual("{ foo: 1 }");
    } else {
      expect(hasColor(consoleLogSpy.calls.first().args[1])).toBe(false);
      expect(stripColor(consoleLogSpy.calls.first().args[1])).toEqual({ foo: 1 });
    }

  });

  ['emergency',
  'alert',
  'critical',
  'error'].forEach((logLevel:LogLevel) => {

    it(`will "console.error" for level [${logLevel}]`, () => {

      logger[logLevel](logLevel);

      expect(stripColor(consoleErrorSpy.calls.first().args[1])).toEqual(logLevel);
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();

    });

  });

  [
  'warning',
  'notice'].forEach((logLevel:LogLevel) => {

    it(`will "console.warn" for level [${logLevel}]`, () => {

      logger[logLevel](logLevel);

      expect(stripColor(consoleWarnSpy.calls.first().args[1])).toEqual(logLevel);
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();

    });

  });

  ['info',
  'debug'].forEach((logLevel:LogLevel) => {

    it(`will "console.log" for level [${logLevel}]`, () => {

      logger[logLevel](logLevel);

      expect(stripColor(consoleLogSpy.calls.first().args[1])).toEqual(logLevel);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();

    });

  });

});
