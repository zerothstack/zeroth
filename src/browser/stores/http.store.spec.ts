import { inject, addProviders, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response } from '@angular/http';
import { Injectable, Injector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { HttpStore } from './http.store';
import { AbstractModel } from '../../common/models/model';
import { Collection } from '../../common/models/collection';
import { Model } from '../../common/registry/decorators';

@Model('tests')
class TestModel extends AbstractModel {
  id: number;
  name: string;
}

@Injectable()
class TestHttpStore extends HttpStore<TestModel> {

  constructor(injector: Injector, http: Http, loggerBase: Logger) {
    super(TestModel, injector, http, loggerBase);
  }

}

const providers = [
  TestHttpStore,
  MockBackend,
  BaseRequestOptions,
  {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions],
    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backend, defaultOptions),
  },
  {provide: Logger, useClass: LoggerMock},
];

describe('Http store', () => {

  beforeEach(() => {
    addProviders(providers);
  });

  it('Retrieves a collection of models from http', async(inject([TestHttpStore, MockBackend], (s: TestHttpStore, b: MockBackend) => {

    let connection: MockConnection;
    b.connections.subscribe((c: MockConnection) => connection = c);

    const testPromise = s.findMany()
      .then((res) => {

        expect(res instanceof Collection)
          .toBe(true);
        expect(res[0] instanceof TestModel)
          .toBe(true);
        expect(res[0].id)
          .toEqual(1);
        expect(res[0].name)
          .toEqual('foo');

      });

    connection.mockRespond(new Response({
      body: [{id: 1, name: 'foo'}],
      status: 200,
      headers: null,
      url: `${process.env.API_BASE}/tests`,
      merge: null
    }));

    return testPromise;

  })));

  it('Logs error on failed collection retrieval', async(inject([TestHttpStore, MockBackend], (s: TestHttpStore, b: MockBackend) => {

    let logSpy = spyOn((s as any).logger, 'error');

    let connection: MockConnection;
    b.connections.subscribe((c: MockConnection) => connection = c);

    const testPromise = s.findMany()
      .catch((res) => {

        expect(logSpy)
          .toHaveBeenCalledWith('not found');
      });

    let response = new Response({
      body: {message: 'not found'},
      status: 404,
      headers: null,
      url: `${process.env.API_BASE}/tests`,
      merge: null
    });

    connection.mockRespond(response);

    return testPromise;

  })));

  it('Retrieves a single model from http', async(inject([TestHttpStore, MockBackend], (s: TestHttpStore, b: MockBackend) => {

    let connection: MockConnection;
    b.connections.subscribe((c: MockConnection) => connection = c);

    const testPromise = s.findOne(123)
      .then((res) => {

        expect(res instanceof TestModel)
          .toBe(true);
        expect(res.id)
          .toEqual(123);
        expect(res.name)
          .toEqual('foo');

      });

    connection.mockRespond(new Response({
      body: {id: 123, name: 'foo'},
      status: 200,
      headers: null,
      url: `${process.env.API_BASE}/tests/123`,
      merge: null
    }));

    return testPromise;

  })));

  it('Logs error on failed model retrieval', async(inject([TestHttpStore, MockBackend], (s: TestHttpStore, b: MockBackend) => {

    let logSpy = spyOn((s as any).logger, 'error');

    let connection: MockConnection;
    b.connections.subscribe((c: MockConnection) => connection = c);

    const testPromise = s.findOne(null)
      .catch((res) => {
        expect(logSpy)
          .toHaveBeenCalledWith('Internal Error');
      });
    connection.mockError(new Error('Internal Error'));

    return testPromise;

  })));

  it('Saves a single model with http', async(inject([TestHttpStore, MockBackend], (s: TestHttpStore, b: MockBackend) => {

    let connection: MockConnection;
    b.connections.subscribe((c: MockConnection) => connection = c);

    const modelData = {id: 123, name: 'foo'};

    const mock = new TestModel(modelData);

    const testPromise = s.saveOne(mock)
      .then((res) => {

        expect(connection.request.getBody())
          .toEqual(JSON.stringify(modelData));
        expect(res instanceof TestModel)
          .toBe(true);
        expect(res.id)
          .toEqual(123);
        expect(res.name)
          .toEqual('foo');

      });

    connection.mockRespond(new Response({
      body: {id: 123, name: 'foo'},
      status: 200,
      headers: null,
      url: `${process.env.API_BASE}/tests/123`,
      merge: null
    }));

    return testPromise;

  })));

});
