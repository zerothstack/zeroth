import { it, expect, describe } from '@angular/core/testing';
import { ConsoleLogger, isBrowser } from './consoleLogger.service';
import { stripColor, hasColor } from 'chalk';
import { LogLevel, LogVerbosity, LogVerbosityType } from './logger.service';
import Spy = jasmine.Spy;

describe('Console Logger', () => {

  let logger: ConsoleLogger;
  let consoleLogSpy: Spy;
  let consoleErrorSpy: Spy;
  let consoleWarnSpy: Spy;
  let envLevel: LogVerbosityType;

  beforeEach(() => {
    logger          = new ConsoleLogger();
    consoleLogSpy   = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
    consoleWarnSpy  = spyOn(console, 'warn');
    envLevel        = process.env.LOG_LEVEL;
  });

  afterEach(() => {
    consoleLogSpy.calls.reset();
    consoleErrorSpy.calls.reset();
    consoleWarnSpy.calls.reset();
    process.env.LOG_LEVEL = envLevel; //reset
  });

  it('logs to the console with a timestamp', () => {

    logger.info('example');

    expect(stripColor(consoleLogSpy.calls.first().args[0]))
      .toMatch(/\[\d{2}:\d{2}:\d{2}\]/);
    expect(stripColor(consoleLogSpy.calls.first().args[1]))
      .toEqual('example');
  });

  it('can have a prefix applied', () => {

    logger.source('test')
      .info('message');

    expect(stripColor(consoleLogSpy.calls.first().args[1]))
      .toEqual('[test]');
    expect(stripColor(consoleLogSpy.calls.first().args[2]))
      .toEqual('message');

  });

  it('can syntax highlight passed objects when in node terminal', () => {

    const nodeTerminal = !isBrowser();

    logger.debug({foo: 1});

    if (nodeTerminal) {
      expect(hasColor(consoleLogSpy.calls.first().args[1]))
        .toBe(true);
      expect(stripColor(consoleLogSpy.calls.first().args[1]))
        .toEqual("{ foo: 1 }");
    } else {
      expect(hasColor(consoleLogSpy.calls.first().args[1]))
        .toBe(false);
      expect(stripColor(consoleLogSpy.calls.first().args[1]))
        .toEqual({foo: 1});
    }

  });

  describe('log criticality', () => {

    [
      'emergency',
      'alert',
      'critical',
      'error'
    ].forEach((logLevel: LogLevel) => {

      it(`will "console.error" for level [${logLevel}]`, () => {

        logger[logLevel](logLevel);

        expect(stripColor(consoleErrorSpy.calls.first().args[1]))
          .toEqual(logLevel);
        expect(consoleLogSpy)
          .not
          .toHaveBeenCalled();
        expect(consoleWarnSpy)
          .not
          .toHaveBeenCalled();

      });

    });

    [
      'warning',
      'notice'
    ].forEach((logLevel: LogLevel) => {

      it(`will "console.warn" for level [${logLevel}]`, () => {

        logger[logLevel](logLevel);

        expect(stripColor(consoleWarnSpy.calls.first().args[1]))
          .toEqual(logLevel);
        expect(consoleLogSpy)
          .not
          .toHaveBeenCalled();
        expect(consoleErrorSpy)
          .not
          .toHaveBeenCalled();

      });

    });

    [
      'info',
      'debug'
    ].forEach((logLevel: LogLevel) => {

      it(`will "console.log" for level [${logLevel}]`, () => {

        logger[logLevel](logLevel);

        expect(stripColor(consoleLogSpy.calls.first().args[1]))
          .toEqual(logLevel);
        expect(consoleErrorSpy)
          .not
          .toHaveBeenCalled();
        expect(consoleWarnSpy)
          .not
          .toHaveBeenCalled();

      });

    });

  });

  describe('log verbosity levels', () => {

    it('logs all messages when the verbosity level is verbose', () => {

      process.env.LOG_LEVEL = 'verbose';
      const persistSpy      = spyOn(logger, 'persistLog')
        .and
        .returnValue(logger);

      [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info',
        'debug',
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);

        expect(persistSpy)
          .toHaveBeenCalledWith(level, [`${level} message`]);
      });

    });

    it('logs no messages when the verbosity level is none', () => {

      process.env.LOG_LEVEL = 'none';
      const persistSpy      = spyOn(logger, 'persistLog')
        .and
        .returnValue(logger);

      [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info',
        'debug',
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);

        expect(persistSpy)
          .not
          .toHaveBeenCalledWith(level, [`${level} message`]);
      });

    });

    it('logs info and above messages when the verbosity level is info', () => {

      process.env.LOG_LEVEL = 'info';
      const persistSpy      = spyOn(logger, 'persistLog')
        .and
        .returnValue(logger);

      logger.debug('debug message');
      expect(persistSpy)
        .not
        .toHaveBeenCalled();

      [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info'
      ].forEach((level: LogLevel) => {

        logger[level](`${level} message`);
        expect(persistSpy)
          .toHaveBeenCalledWith(level, [`${level} message`]);
      });

    });

    it('logs error and above messages when the verbosity level is error', () => {

      process.env.LOG_LEVEL = 'error';
      const persistSpy      = spyOn(logger, 'persistLog')
        .and
        .returnValue(logger);

      [
        'emergency',
        'alert',
        'critical',
        'error',
      ].forEach((level: LogLevel) => {

        logger[level](`${level} message`);
        expect(persistSpy)
          .toHaveBeenCalledWith(level, [`${level} message`]);
      });

      persistSpy.calls.reset();

      [
        'warning',
        'notice',
        'info'
      ].forEach((level: LogLevel) => {

        logger[level](`${level} message`);
        expect(persistSpy)
          .not
          .toHaveBeenCalled();
      });

    });

    it('can override the verbosity level to silly on an individual log so it does not log when level verbose', () => {

      process.env.LOG_LEVEL = 'verbose';
      const persistSpy      = spyOn(logger, 'persistLog')
        .and
        .returnValue(logger);

      logger.silly.debug('debug');

      expect(persistSpy)
        .not
        .toHaveBeenCalled();

      logger.debug('debug');

      expect(persistSpy)
        .toHaveBeenCalled();

    });

    it('can override the verbosity level to verbose on an individual log so it does not log when level info', () => {

      process.env.LOG_LEVEL = 'info';
      const persistSpy      = spyOn(logger, 'persistLog')
        .and
        .returnValue(logger);

      logger.verbose.info('info');

      expect(persistSpy)
        .not
        .toHaveBeenCalled();

      logger.info('info');

      expect(persistSpy)
        .toHaveBeenCalled();
    });

  });

});
