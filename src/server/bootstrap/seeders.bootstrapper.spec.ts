import { it, beforeEachProviders, expect } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { ServerMock } from '../servers/abstract.server.spec';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { Server } from '../servers/abstract.server';
import { bootstrap, BootstrapResponse } from './index';
import { registry } from '../../common/registry/entityRegistry';
import { AbstractSeeder } from '../seeders/index';
import Spy = jasmine.Spy;

let loggerInstance: Logger = new LoggerMock();

const providers: any[] = [
  {
    provide: Logger,
    deps: [],
    useValue: loggerInstance
  },
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
];

@Injectable()
export class TestSeeder extends AbstractSeeder {

  constructor(logger: Logger) {
    super(logger);
  }

  public seed(): Promise<void> {
    this.logger.debug('Test seeder running');
    return Promise.resolve();
  }

}

describe('Seeder Bootstrapper', () => {

  beforeEachProviders(() => providers);

  beforeEach(() => {
    registry.clearAll();

    registry.register('seeder', TestSeeder);

  });

  it('resolves and runs seeder', (done: Function) => {

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const result = bootstrap(null, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(loggerSpy)
        .toHaveBeenCalledWith('info', ['seeding TestSeeder']);
      expect(loggerSpy)
        .toHaveBeenCalledWith('debug', ['Test seeder running']);
      done();

    });

  });

});
