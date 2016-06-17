import { it, inject, beforeEachProviders, expect, describe } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response } from '@angular/http';
import { Injectable, provide } from '@angular/core';
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
    /**
     * @todo resolve why the <any>http is needed to suppress the following error:
     *
     * src/browser/stores/user.http.store.ts(13,17): error TS2345: Argument of type 'Http' is not
     *   assignable to parameter of type 'Http'. Property '_backend' is protected but type 'Http'
     *   is not a class derived from 'Http'.
     *
     * It may have something to do with both ubiquits/core and the current project
     * depending on angular so TS thinks they could be different implementations?
     */
    super(TestModel, <any>http, loggerBase);
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
  provide(Http, {
    deps: [MockBackend, BaseRequestOptions],
    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backend, defaultOptions),
  }),
  provide(Logger, {useClass: LoggerMock}),
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
      statusText: 'OK',
      type: 0,
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
