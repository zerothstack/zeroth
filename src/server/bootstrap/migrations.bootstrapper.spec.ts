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
import { AbstractMigration } from '../migrations/index';
import { Database } from '../services/database.service';
import { DatabaseMock } from '../services/database.service.mock';
import Spy = jasmine.Spy;
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';

let loggerInstance: Logger = new LoggerMock();
let databaseInstance: Database;

const providers: any[] = [
  {
    provide: Logger,
    deps: [],
    useValue: loggerInstance
  },
  {
    provide: Database,
    deps: [Logger],
    useFactory: (logger: Logger) => {
      if (!databaseInstance) {
        databaseInstance = new DatabaseMock(logger);
      }
      return databaseInstance;
    }
  },
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
];

@Injectable()
export class TestMigration extends AbstractMigration {

  constructor(logger: Logger, database: Database) {
    super(logger, database);
  }

  public migrate(): Promise<void> {

    return this.database.initialize()
      .then(() => {
        this.logger.debug('Test migration running');
        return Promise.resolve();
      });

  }

  public rollback(): any {
  }

}

describe('Migration Bootstrapper', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
    EntityRegistry.clearAll();

    EntityRegistry.register('migration', TestMigration);

  });

  it('resolves and runs migration', (done: Function) => {

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(loggerSpy)
        .toHaveBeenCalledWith('debug', ['Test migration running']);
      done();

    });

  });

  it('continues bootstrap even when database refuses connection', (done: Function) => {

    const loggerSpy = spyOn(loggerInstance, 'persistLog')
      .and
      .callThrough();
    spyOn(loggerInstance, 'source')
      .and
      .callFake(() => loggerInstance);

    spyOn(databaseInstance, 'initialize')
      .and
      .callFake(() => {
        const err         = new Error();
        (err as any).code = 'ECONNREFUSED';
        return Promise.reject(err);
      });

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(loggerSpy)
        .toHaveBeenCalledWith('notice', ['Database not available, migration cannot run']);

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

    spyOn(databaseInstance, 'initialize')
      .and
      .callFake(() => {
        const err = new Error('Something else went wrong');
        return Promise.reject(err);
      });

    const result = bootstrap(undefined, providers)();

    return result.then((res: BootstrapResponse) => {

      expect(processExitSpy)
        .toHaveBeenCalledWith(1);

      expect(loggerSpy)
        .toHaveBeenCalledWith('critical', ['Error', 'Something else went wrong']);

      done();

    });

  });

});
