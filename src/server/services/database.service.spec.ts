import { Logger } from '../../common/services/logger.service';
import { Database } from './database.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as typeorm from 'typeorm';
import { Driver } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { Injectable } from '@angular/core';
import { RemoteCli } from './remoteCli.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { RemoteCliMock } from './remoteCli.service.mock';
import { EntityRegistry } from '../../common/registry/entityRegistry';
import * as SQL from 'sql-template-strings';
import { AuthServiceMock } from './auth.service.mock';
import { AuthService } from './auth.service';
import Spy = jasmine.Spy;

@Injectable()
class ExampleUtil {

  constructor(protected database: Database, protected logger: Logger) {
  }

  public flagLongUsernames(role: string, length: number): Promise<void> {

    let queryRunner: QueryRunner;
    return this.database.getDriver()
      .then((driver: Driver) => driver.createQueryRunner())
      .then((qr) => {
        queryRunner = qr;
        return qr.beginTransaction();
      })
      .then(() => this.database.query(Database.prepare`UPDATE users SET flagged = LENGTH(username) > ${length} WHERE role = ${role}`))
      .then(() => queryRunner.commitTransaction())
      .catch(() => queryRunner.rollbackTransaction());

  }

}

describe('Database', () => {

  let createConnectionSpy: Spy;
  const connectionSpy: any = {};

  const providers = [
    {provide: Logger, useClass: LoggerMock},
    {provide: RemoteCli, useClass: RemoteCliMock},
    {provide: AuthService, useClass: AuthServiceMock},
    Database,
    ExampleUtil
  ];

  const envMap = {
    DB_DRIVER: 'driver',
    DB_HOST: 'host',
    DB_PORT: 'port',
    DB_USERNAME: 'username',
    DB_PASSWORD: 'password',
    DB_DATABASE: 'database',
  };

  const connectionConfigFixture: any = {
    name: 'default',
    driver: {
      type: envMap.DB_DRIVER,
      host: envMap.DB_HOST,
      port: envMap.DB_PORT,
      username: envMap.DB_USERNAME,
      password: envMap.DB_PASSWORD,
      database: envMap.DB_DATABASE,
      usePool: false,
    },
    autoSchemaSync: false,
    logging: {
      logger: jasmine.any(Function),
      logQueries: true,
    },
    entities: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({providers});

    EntityRegistry.clearAll();
    Object.assign(process.env, envMap);
    createConnectionSpy = spyOn(typeorm, 'createConnection')
      .and
      .callFake(() => {
        return Promise.resolve(connectionSpy);
      })

  });

  afterEach(() => {
    Database.clearConnections();
  });

  it('initializes database with connection', async(inject([Database], (database: Database) => {

    expect(createConnectionSpy)
      .toHaveBeenCalledWith(connectionConfigFixture);

    return database.getConnection()
      .then((conn) => {
        expect(conn)
          .toEqual(connectionSpy);
      });

  })));

  it('retrieves an instance of the connection', async(inject([Database], (database: Database) => {

    return database.getConnection()
      .then((conn) => {
        expect(conn)
          .toEqual(connectionSpy);
      });

  })));

  it('interfaces the typeorm logger function with the logger function', inject([Database, Logger], (database: Database, logger: Logger) => {

    const logFunctionSpy = jasmine.createSpy('logFunction');

    Database.connect('default', logFunctionSpy);

    expect(createConnectionSpy)
      .toHaveBeenCalledWith(connectionConfigFixture);

    const logFunction = createConnectionSpy.calls.mostRecent().args[0].logging.logger;

    logFunction('log', 'log with level log');
    expect(logFunctionSpy)
      .toHaveBeenCalledWith('info', 'log with level log');

    logFunction('warn', 'log with level warn');
    expect(logFunctionSpy)
      .toHaveBeenCalledWith('warning', 'log with level warn');

    logFunction('error', 'log with level error');
    expect(logFunctionSpy)
      .toHaveBeenCalledWith('error', 'log with level error');

  }));

  describe('Connection error', () => {

    it('rejects connection if connection fails', async(inject([Database], (database: Database) => {

      // clear cached default connection
      Database.clearConnections();

      // force failure
      createConnectionSpy.and.callFake(() => {
        return Promise.reject(new Error('Connection error'));
      });

      return database.initialize()
        .catch((error: Error) => {
          expect(error.message)
            .toEqual('Connection error');
        });

    })));

  });

  it('executes a raw query on the database', async(inject([Database], (database: Database) => {

    const resultMock = [{foo: 'bar'}];

    const queryRunnerMock = {
      query: jasmine.createSpy('query')
        .and
        .returnValue(resultMock)
    };

    connectionSpy.driver = {
      createQueryRunner: jasmine.createSpy('createQueryRunner')
        .and
        .returnValue(Promise.resolve(queryRunnerMock))
    };

    const queryString = 'SELECT * FROM table';

    return database.query(queryString)
      .then((result) => {

        expect(queryRunnerMock.query)
          .toHaveBeenCalledWith(queryString);
        expect(result)
          .toEqual(resultMock);
      });

  })));

  describe('Complex queries', () => {

    it('runs complex queries with transactions and prepared statements', async(inject([ExampleUtil, Database], (util: ExampleUtil, database: Database) => {

      const resultMock = [{foo: 'bar'}];

      const queryRunnerMock = {
        beginTransaction: jasmine.createSpy('beginTransaction').and.returnValue(Promise.resolve()),
        commitTransaction: jasmine.createSpy('commitTransaction')
          .and
          .returnValue(Promise.resolve()),
        query: jasmine.createSpy('query')
          .and
          .returnValue(resultMock)
      };

      connectionSpy.driver = {
        createQueryRunner: jasmine.createSpy('createQueryRunner')
          .and
          .returnValue(Promise.resolve(queryRunnerMock))
      };

      return util.flagLongUsernames('admin', 5)
        .then(() => {

          expect(queryRunnerMock.beginTransaction).toHaveBeenCalled();
          expect(queryRunnerMock.query)
            .toHaveBeenCalledWith((SQL as any)`UPDATE users SET flagged = LENGTH(username) > ${5} WHERE role = ${'admin'}`);
          expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
        });

    })));

    it('runs complex queries with exceptions rolling back transactions', async(inject([ExampleUtil, Database], (util: ExampleUtil, database: Database) => {

      const queryRunnerMock = {
        beginTransaction: jasmine.createSpy('beginTransaction').and.returnValue(Promise.resolve()),
        commitTransaction: jasmine.createSpy('commitTransaction')
          .and
          .returnValue(Promise.resolve()),
        rollbackTransaction: jasmine.createSpy('rollbackTransaction')
          .and
          .returnValue(Promise.resolve()),
        query: jasmine.createSpy('query').and.returnValue(Promise.reject(new Error('DB Error'))),
      };

      connectionSpy.driver = {
        createQueryRunner: jasmine.createSpy('createQueryRunner')
          .and
          .returnValue(Promise.resolve(queryRunnerMock))
      };

      return util.flagLongUsernames('admin', 5)
        .then(() => {

          expect(queryRunnerMock.beginTransaction).toHaveBeenCalled();
          expect(queryRunnerMock.query).toHaveBeenCalled();
          expect(queryRunnerMock.commitTransaction).not.toHaveBeenCalled();
          expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
        });

    })));

  });

});
