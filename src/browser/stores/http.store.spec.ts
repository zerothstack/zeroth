import { it, inject, beforeEachProviders, expect, describe } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { HttpStore } from './http.store';
import { Model } from '../../common/models/model';
import { Collection } from '../../common/models/collection';

class TestModel extends Model {
  id: number;
  name: string;
}

@Injectable()
class TestHttpStore extends HttpStore<TestModel> {

  constructor(http: Http, loggerBase: Logger) {
    super(TestModel, http, loggerBase);
  }

  protected endpoint(id?: string): string {

    let endpoint = `${process.env.API_BASE}/tests`;

    if (id) {
      endpoint += id;
    }

    return endpoint;
  };

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

  beforeEachProviders(() => providers);

  it('Retrieves a collection of models from http', inject([TestHttpStore, MockBackend], (s: TestHttpStore, b: MockBackend) => {

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

  }));

  xit('Logs error on failed collection retrieval', () => {
    // @todo
  });
  xit('Retrieves a single model from http', () => {
    // @todo
  });
  xit('Logs error on failed model retrieval', () => {
    // @todo
  });

});
