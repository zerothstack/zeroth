import { it, beforeEachProviders, expect, describe } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.spec';
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

  beforeEachProviders(() => providers);

  beforeEach(() => {
    registry.clearAll();

    registry.register('service', TestService);

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

});
