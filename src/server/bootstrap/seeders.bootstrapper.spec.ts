import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { ServerMock } from '../servers/abstract.server.mock';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { Server } from '../servers/abstract.server';
import { bootstrap, BootstrapResponse } from './bootstrap';
import { EntityRegistry } from '../../common/registry/entityRegistry';
import { AbstractSeeder } from '../seeders/index';
import Spy = jasmine.Spy;
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';

let loggerInstance: Logger = new LoggerMock();

const providers: any[] = [
  {
    provide: Logger,
    deps: [],
    useValue: loggerInstance
  },
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
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

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
    EntityRegistry.clearAll();

    EntityRegistry.register('seeder', TestSeeder);

  });

  it('resolves and runs seeder', (done: Function) => {

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(loggerSpy)
        .toHaveBeenCalledWith('debug', ['Test seeder running']);
      done();

    });

  });

});
