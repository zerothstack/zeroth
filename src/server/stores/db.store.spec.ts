import { Logger } from '../../common/services/logger.service';
import { Injectable, Injector } from '@angular/core';
import { it, inject, beforeEachProviders, expect } from '@angular/core/testing';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { DatabaseMock } from '../services/database.service.spec';
import { Database } from '../services/database.service';
import { DatabaseStore } from './db.store';
import { BaseModel } from '../../common/models/model';
import { Primary } from '../../common/models/types/primary.decorator';
import { StoredProperty } from '../../common/models/types/storedProperty.decorator';
import Spy = jasmine.Spy;
import { NotFoundException } from '../exeptions/exceptions';
import { Collection } from '../../common/models/collection';

class TestModel extends BaseModel {

  @Primary()
  id: number;

  @StoredProperty()
  name: string;

}

@Injectable()
class TestDatabaseStore extends DatabaseStore<TestModel> {
  constructor(injector: Injector, database: Database, loggerBase: Logger) {
    super(TestModel, injector, database, loggerBase);
  }
}

describe('Database Store', () => {

  const repositorySpy   = jasmine.createSpyObj('repository', ['findOneById', 'find', 'persist']);
  const dbConnectionSpy = jasmine.createSpyObj('dbConnection', ['getRepository']);
  dbConnectionSpy.getRepository.and.returnValue(repositorySpy);

  const providers = [
    TestDatabaseStore,
    {provide: Logger, useClass: LoggerMock},
    {provide: Database, useClass: DatabaseMock},
  ];

  beforeEachProviders(() => providers);

  it('initializes the store with a reference to the static model', inject([TestDatabaseStore], (store: TestDatabaseStore) => {

    expect((store as any).modelStatic)
      .toEqual(TestModel);

  }));

  it('retrieves a reference to the orm repository', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    return store.getRepository()
      .then((repo) => {
        expect(repo)
          .toEqual(repositorySpy);
        expect(dbConnectionSpy.getRepository)
          .toHaveBeenCalledTimes(1);

        //verify repo is cached by re-calling and asserting no more calls to getRepository
        return store.getRepository()
          .then(() => {
            expect(repo)
              .toEqual(repositorySpy);
            expect(dbConnectionSpy.getRepository)
              .toHaveBeenCalledTimes(1);
          });

      });

  }));

  it('provides initialized method so callees can defer actions', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    return store.initialized()
      .then((res) => {
        expect(res)
          .toEqual(store);
      });

  }));

  it('retrieves a single entity from the orm', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    const testModelFixture = new TestModel({id: 10});

    repositorySpy.findOneById.and.returnValue(Promise.resolve(testModelFixture));

    return store.findOne(testModelFixture.id)
      .then((res) => {
        expect(repositorySpy.findOneById)
          .toHaveBeenCalledWith(testModelFixture.id);
        expect(res)
          .toEqual(testModelFixture);
      });

  }));

  it('rejects retrieval with not found exception when there is no model', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    repositorySpy.findOneById.and.returnValue(Promise.resolve(null));

    return store.findOne(123)
      .catch((err: Error) => {
        expect(err instanceof NotFoundException)
          .toBe(true);
        expect(err.message)
          .toEqual('TestModel not found with id [123]');
      });

  }));

  it('retrieves collection of entities from the orm', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    const testModelsFixture = [new TestModel({id: 12})];

    repositorySpy.find.and.returnValue(Promise.resolve(testModelsFixture));

    return store.findMany()
      .then((res: any) => {
        expect(repositorySpy.find)
          .toHaveBeenCalledWith({});
        expect(res instanceof Collection)
          .toBe(true);
        expect(res[0])
          .toEqual(testModelsFixture[0]);
      });

  }));

  it('rejects retrieval with not found exception when there is no models', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    repositorySpy.find.and.returnValue(Promise.resolve([]));

    return store.findMany()
      .catch((err: any) => {
        expect(repositorySpy.find)
          .toHaveBeenCalledWith({});

        expect(err instanceof NotFoundException)
          .toBe(true);
        expect(err.message)
          .toEqual('No TestModel found with query params [undefined]');
      });

  }));



  it('persists a single entity to the orm', inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    db.initialized = Promise.resolve(dbConnectionSpy);

    const testModelFixture = new TestModel({id: 10});

    repositorySpy.persist.and.returnValue(Promise.resolve(testModelFixture));

    return store.saveOne(testModelFixture)
      .then((res) => {
        expect(repositorySpy.persist)
          .toHaveBeenCalledWith(testModelFixture);
        expect(res)
          .toEqual(testModelFixture);
      });

  }));

});


