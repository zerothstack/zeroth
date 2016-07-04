import { addProviders } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { bootstrap, BootstrapResponse } from './index';
import { registry } from '../../common/registry/entityRegistry';
import { AbstractService } from '../../common/services/service';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { ServerMock } from '../servers/abstract.server.spec';
import { Server } from '../servers/abstract.server';
import Spy = jasmine.Spy;

let loggerInstance: Logger = new LoggerMock();

let INIT_SUCCESS: boolean = true;

const providers: any[] = [
  {
    provide: Logger,
    useValue: loggerInstance
  },
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
];

@Injectable()
export class TestService extends AbstractService {

  constructor(protected logger: Logger) {
    super();
  }

  public initialize(): Promise<this> {
    this.logger.info('Initializing service');
    return INIT_SUCCESS ? Promise.resolve(this) : Promise.reject(new Error('Service init failed'));
  }

  public testLog(message: string): void {
    this.logger.info(message);
  }

}

describe('Service Bootstrapper', () => {

  beforeEach(() => {
    addProviders(providers);
    registry.clearAll();

    registry.register('service', TestService);

    INIT_SUCCESS = true;

  });

  it('resolves and initializes service', (done: Function) => {

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      const service = res.injector.get(TestService);

      expect(loggerSpy)
        .toHaveBeenCalledWith('info', ['Initializing service']);

      service.testLog('test log');

      expect(loggerSpy)
        .toHaveBeenCalledWith('info', ['test log']);

      done();

    });

  });

  it('aborts bootstrap when a fatal error occurs', (done: Function) => {

    //as there is a fallback to output to log when a fatal bootstrap happens even when mocked,
    //here we spy on the console to suppress the log output
    spyOn(console, 'error');
    spyOn(console, 'log');

    const processExitSpy = spyOn(process, 'exit');

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    INIT_SUCCESS = false;

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(processExitSpy)
        .toHaveBeenCalledWith(1);

      expect(loggerSpy)
        .toHaveBeenCalledWith('critical', ['Error', 'Service init failed']);

      done();

    });

  });

  it('can provide a new value for a registry instantiated service', (done: Function) => {

    class EnhancedTestService extends TestService {

      public initialize(): Promise<this> {
        return this.enhancedInit();
      }

      public enhancedInit(): Promise<this> {
        return Promise.resolve(this);
      }

    }

    let enhanceSpy: Spy;

    providers.push({
      provide: TestService,
      deps: [Logger],
      useFactory: (logger: Logger) => {
        const service = new EnhancedTestService(logger);
        enhanceSpy    = spyOn(service, 'enhancedInit')
          .and
          .callThrough();
        return service;
      },
    });

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      const service = res.injector.get(TestService);

      expect(service instanceof EnhancedTestService)
        .toBe(true);

      expect(enhanceSpy)
        .toHaveBeenCalled();

      done();

    });

  });

  it('instantiates a service that has no explicit initialize method', (done: Function) => {

    class BasicTestService extends AbstractService {
      public test(): boolean {
        return true;
      }
    }

    let initSpy: Spy;

    providers.push({
      provide: TestService,
      deps: [],
      useFactory: () => {
        const service = new BasicTestService();
        initSpy       = spyOn(service, 'initialize')
          .and
          .callThrough();
        return service;
      },
    });

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      const service = res.injector.get(TestService);

      expect(service instanceof BasicTestService)
        .toBe(true);
      expect(service.test())
        .toEqual(true);

      expect(initSpy)
        .toHaveBeenCalled();

      done();

    });

  });

});
