import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { ServerMock } from '../servers/abstract.server.mock';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { Server } from '../servers/abstract.server';
import { registry } from '../../common/registry/entityRegistry';
import { ClassDictionary, BootstrapResponse, bootstrap, deferredLog } from './bootstrap';
import Spy = jasmine.Spy;
import { AuthService } from '../services/auth.service';
import { AuthServiceMock } from '../services/auth.service.mock';

let loggerInstance: Logger;

const providers: any[] = [
  {
    provide: Logger,
    deps: [],
    useFactory: () => {
      if (!loggerInstance) {
        loggerInstance = new LoggerMock();
      }
      return loggerInstance;
    }
  },
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
];

describe('Bootstrap', () => {

  beforeEach(() => {
    registry.clearAll();
  });

  it('resolves server, logger and injector from providers', (done: Function) => {

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(res.logger instanceof Logger)
        .toBe(true, "bootstrap response logger is not instanceof Logger");
      expect(res.server instanceof Server)
        .toBe(true, "bootstrap response server is not instanceof Server");

      // Cannot check instanceof Injector for some reason, instead test that the injector works
      expect(res.injector.get(Server))
        .toEqual(res.server);
      done();
    });

  });

  it('calls an afterBootstrap function when provided', (done: Function) => {

    const afterBootstrapFn = jasmine.createSpy('afterBootstrapFn');

    const result = bootstrap(undefined, providers, afterBootstrapFn)();

    return result.then((res: BootstrapResponse) => {

      expect(afterBootstrapFn)
        .toHaveBeenCalledWith(res);
      done();

    });

  });

  it('can buffer logs created before the logger is instantiated, then invoke the logger with the buffer', (done: Function) => {

    deferredLog('debug', 'this is a debug message');

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(loggerSpy)
        .toHaveBeenCalledWith('debug', ['this is a debug message']);
      done();
    });

  });

  it('aborts startup when an error is encountered after bootstrappers ran, and logs error', (done: Function) => {

    //as there is a fallback to output to log when a fatal bootstrap happens even when mocked,
    //here we spy on the console to suppress the log output
    const consoleErrorSpy = spyOn(console, 'error');
    spyOn(console, 'log');

    const error = new Error('Something is not right!');

    const afterBootstrapFn = () => {
      deferredLog('debug', 'this is a debug message');
      throw error;
    };

    const processExitSpy = spyOn(process, 'exit');

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const result = bootstrap(undefined, providers, afterBootstrapFn)();

    return result.then((res: BootstrapResponse) => {

      expect(processExitSpy)
        .toHaveBeenCalledWith(1);

      expect(loggerSpy)
        .toHaveBeenCalledWith('critical', ['Error', 'Something is not right!']);

      expect(loggerSpy)
        .toHaveBeenCalledWith('debug', ['this is a debug message']);

      expect(consoleErrorSpy)
        .toHaveBeenCalledWith(error);

      done();

    });
  });

  it('aborts startup when an error is before providers resolve, and logs with fallback console', (done: Function) => {

    deferredLog('debug', 'this is a debug message');

    const processExitSpy = spyOn(process, 'exit');

    const consoleErrorSpy = spyOn(console, 'error');
    const consoleLogSpy   = spyOn(console, 'log');

    const providersWithError = providers.concat([new Error]);

    const result = bootstrap(undefined, providersWithError)();

    return result.then((res: BootstrapResponse) => {

      expect(processExitSpy)
        .toHaveBeenCalledWith(1);

      expect(consoleErrorSpy)
        .toHaveBeenCalled();
      expect(consoleLogSpy)
        .toHaveBeenCalledWith('debug', 'this is a debug message');

      done();

    });

  });

  it('logs the classes that were loaded', (done: Function) => {

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const classMap:ClassDictionary<any>[] = [{FooController:null}];

    const result = bootstrap(classMap, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(loggerSpy)
        .toHaveBeenCalledWith('debug', ['Classes loaded from app', [ 'FooController' ]]);

      done();

    });
  });

});
