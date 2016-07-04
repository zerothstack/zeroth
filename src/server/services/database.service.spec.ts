import { Logger } from '../../common/services/logger.service';
import { Database } from './database.service';
import { addProviders, inject, async } from '@angular/core/testing';
import * as typeorm from 'typeorm';
import { RemoteCli } from './remoteCli.service';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { RemoteCliMock } from './remoteCli.service.mock';
import { registry } from '../../common/registry/entityRegistry';
import Spy = jasmine.Spy;

describe('Database', () => {

  let createConnectionSpy: Spy;
  const connectionSpy: any = {};

  const providers = [
    {provide: Logger, useClass: LoggerMock},
    {provide: RemoteCli, useClass: RemoteCliMock},
    Database,
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
    addProviders(providers);

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

});
