import { Logger } from '../../common/services/logger.service';
import { Injectable, Injector } from '@angular/core';
import { inject, TestBed, async } from '@angular/core/testing';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { Database } from '../services/database.service';
import { DatabaseStore } from './db.store';
import { AbstractModel } from '../../common/models/model';
import { Primary } from '../../common/models/types/primary.decorator';
import { StoredProperty } from '../../common/models/types/storedProperty.decorator';
import { Collection } from '../../common/models/collection';
import { DatabaseMock } from '../services/database.service.mock';
import Spy = jasmine.Spy;
import { NotFoundException } from '../../common/exceptions/exceptions';

class TestModel extends AbstractModel {

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

  const dbConnectionSpy = jasmine.createSpyObj('dbConnection', ['getRepository']);
  const repositorySpy   = jasmine.createSpyObj('repository', ['findOneById', 'find', 'persist', 'remove']);
  dbConnectionSpy.getRepository.and.returnValue(repositorySpy);

  const providers = [
    TestDatabaseStore,
    {provide: Logger, useClass: LoggerMock},
    {provide: Database, useClass: DatabaseMock},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  it('initializes the store with a reference to the static model', inject([TestDatabaseStore], (store: TestDatabaseStore) => {

    expect((store as any).modelStatic).toEqual(TestModel);
  }));

  it('retrieves a reference to the orm repository', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

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

  })));

  it('provides initialized method so callees can defer actions', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

    return store.initialized()
      .then((res) => {
        expect(res)
          .toEqual(store);
      });

  })));

  it('retrieves a single entity from the orm', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

    const testModelFixture = new TestModel({id: 10});

    repositorySpy.findOneById.and.returnValue(Promise.resolve(testModelFixture));

    return store.findOne(testModelFixture.id)
      .then((res) => {
        expect(repositorySpy.findOneById)
          .toHaveBeenCalledWith(testModelFixture.id);
        expect(res)
          .toEqual(testModelFixture);
      });

  })));

  it('rejects retrieval with not found exception when there is no model', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

    repositorySpy.findOneById.and.returnValue(Promise.resolve(null));

    return store.findOne(123)
      .catch((err: Error) => {
        expect(err instanceof NotFoundException)
          .toBe(true);
        expect(err.message)
          .toEqual('TestModel not found with id [123]');
      });

  })));

  it('deletes a single entity from the orm', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

    const testModelFixture = new TestModel({id: 10});

    repositorySpy.remove.and.returnValue(Promise.resolve(testModelFixture));

    return store.deleteOne(testModelFixture)
      .then((res) => {
        expect(repositorySpy.remove)
          .toHaveBeenCalledWith(testModelFixture);
        expect(res)
          .toEqual(testModelFixture);
      });

  })));

  it('retrieves collection of entities from the orm', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

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

  })));

  it('rejects retrieval with not found exception when there is no models', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

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

  })));

  it('persists a single entity to the orm', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

    const testModelFixture = new TestModel({id: 10});

    repositorySpy.persist.and.returnValue(Promise.resolve(testModelFixture));

    return store.saveOne(testModelFixture)
      .then((res) => {
        expect(repositorySpy.persist)
          .toHaveBeenCalledWith(testModelFixture);
        expect(res)
          .toEqual(testModelFixture);
      });

  })));

  it('checks if entity exists in the orm', async(inject([TestDatabaseStore, Database], (store: TestDatabaseStore, db: Database) => {

    (Database as any).connections.set('default', dbConnectionSpy);

    const testModelFixture = new TestModel({id: 10});

    repositorySpy.findOneById.and.returnValue(Promise.resolve(testModelFixture));

    return store.hasOne(testModelFixture)
      .then((res) => {
        expect(res)
          .toBe(true);
        repositorySpy.findOneById.and.returnValue(Promise.reject(new Error('not found')));

        return store.hasOne(testModelFixture);
      })
      .then((res) => {
        expect(res)
          .toBe(false);
      });

  })));

});


