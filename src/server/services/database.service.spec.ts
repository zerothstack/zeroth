import { Logger } from '../../common/services/logger.service';
import { Database } from './database.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as typeorm from 'typeorm';
import { Driver } from 'typeorm';
import { Injectable } from '@angular/core';
import { RemoteCli } from './remoteCli.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { RemoteCliMock } from './remoteCli.service.mock';
import { registry } from '../../common/registry/entityRegistry';
import * as SQL from 'sql-template-strings';
import Spy = jasmine.Spy;
import { AuthServiceMock } from './auth.service.mock';
import { AuthService } from './auth.service';

@Injectable()
class ExampleUtil {

  constructor(protected database: Database, protected logger: Logger) {
  }

  public flagLongUsernames(role: string, length: number): Promise<void> {

    let driver: Driver;
    return this.database.getDriver()
      .then((d: Driver) => {
        driver = d;
        return driver.beginTransaction();
      })
      .then(() => this.database.query(Database.prepare`UPDATE users SET flagged = LENGTH(username) > ${length} WHERE role = ${role}`))
      .then(() => driver.commitTransaction())
      .catch(() => driver.rollbackTransaction());

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
    driver: envMap.DB_DRIVER,
    connection: {
      host: envMap.DB_HOST,
      port: envMap.DB_PORT,
      username: envMap.DB_USERNAME,
      password: envMap.DB_PASSWORD,
      database: envMap.DB_DATABASE,
      autoSchemaCreate: false,
      logging: {
        logger: jasmine.any(Function),
        logQueries: true,
      }
    },
    entities: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });

    registry.clearAll();
    Object.assign(process.env, envMap);
    createConnectionSpy = spyOn(typeorm, 'createConnection')
      .and
      .callFake(() => {
        return Promise.resolve(connectionSpy);
      })

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

    Database.connect(logFunctionSpy);

    expect(createConnectionSpy)
      .toHaveBeenCalledWith(connectionConfigFixture);

    const logFunction = createConnectionSpy.calls.mostRecent().args[0].connection.logging.logger;

    logFunction('log with level log', 'log');
    expect(logFunctionSpy)
      .toHaveBeenCalledWith('info', 'log with level log');

    logFunction('log with level error', 'error');
    expect(logFunctionSpy)
      .toHaveBeenCalledWith('error', 'log with level error');

  }));

  describe('Connection error', () => {

    beforeEach(() => {

      createConnectionSpy.and.callFake(() => {
        return Promise.reject(new Error('Connection error'));
      })

    });

    it('rejects initialization promise if connection fails', async(inject([Database], (database: Database) => {

      expect(createConnectionSpy)
        .toHaveBeenCalledWith(connectionConfigFixture);

      return database.getConnection()
        .catch((error: Error) => {
          expect(error.message)
            .toEqual('Connection error');
        });

    })));

  });

  it('executes a raw query on the database', async(inject([Database], (database: Database) => {

    const resultMock     = [{foo: 'bar'}];
    connectionSpy.driver = {
      query: jasmine.createSpy('query')
        .and
        .returnValue(resultMock)
    };

    const queryString = 'SELECT * FROM table';

    return database.query(queryString)
      .then((result) => {

        expect(connectionSpy.driver.query)
          .toHaveBeenCalledWith(queryString);
        expect(result)
          .toEqual(resultMock);
      });

  })));

  describe('Complex queries', () => {

    it('runs complex queries with transactions and prepared statements', async(inject([ExampleUtil, Database], (util: ExampleUtil, database: Database) => {

      const resultMock = [{foo: 'bar'}];

      const driverMock = {
        beginTransaction: jasmine.createSpy('beginTransaction').and.returnValue(Promise.resolve()),
        commitTransaction: jasmine.createSpy('commitTransaction').and.returnValue(Promise.resolve()),
        query: jasmine.createSpy('query').and.returnValue(resultMock),
      };

      connectionSpy.driver = driverMock;

      return util.flagLongUsernames('admin', 5)
        .then(() => {

          expect(connectionSpy.driver.beginTransaction).toHaveBeenCalled();
          expect(connectionSpy.driver.query)
            .toHaveBeenCalledWith((SQL as any)`UPDATE users SET flagged = LENGTH(username) > ${5} WHERE role = ${'admin'}`);
          expect(connectionSpy.driver.commitTransaction).toHaveBeenCalled();
        });

    })));

    it('runs complex queries with exceptions rolling back transactions', async(inject([ExampleUtil, Database], (util: ExampleUtil, database: Database) => {

      const driverMock = {
        beginTransaction: jasmine.createSpy('beginTransaction').and.returnValue(Promise.resolve()),
        commitTransaction: jasmine.createSpy('commitTransaction').and.returnValue(Promise.resolve()),
        rollbackTransaction: jasmine.createSpy('rollbackTransaction').and.returnValue(Promise.resolve()),
        query: jasmine.createSpy('query').and.returnValue(Promise.reject(new Error('DB Error'))),
      };

      connectionSpy.driver = driverMock;

      return util.flagLongUsernames('admin', 5)
        .then(() => {

          expect(connectionSpy.driver.beginTransaction).toHaveBeenCalled();
          expect(connectionSpy.driver.query).toHaveBeenCalled();
          expect(connectionSpy.driver.commitTransaction).not.toHaveBeenCalled();
          expect(connectionSpy.driver.rollbackTransaction).toHaveBeenCalled();
        });

    })));

  });

});
