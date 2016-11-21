import { inject, TestBed, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { ResourceController } from './resource.controller';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { AbstractModel, identifier } from '../../common/models/model';
import { ServerMock } from '../servers/abstract.server.mock';
import { MockStore } from '../../common/stores/mock.store';
import { AbstractStore } from '../../common/stores/store';
import { RemoteCli } from '../services/remoteCli.service';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { Request } from './request';
import { Response } from './response';
import { Collection } from '../../common/models/collection';
import { EventEmitter } from 'events';
import { IncomingMessage } from 'http';
import { Primary } from '../../common/models/types/primary.decorator';
import * as _ from 'lodash';
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';

class Fruit extends AbstractModel {
  @Primary()
  public fruitId: number;

  public name: string;

}

abstract class FruitStore extends AbstractStore<Fruit> {

}

class FruitMockStore extends MockStore<Fruit> {

  constructor() {
    super(Fruit, null);
  }

  protected getMock(id?: identifier): Fruit {
    return new this.modelStatic({
      fruitId: id || this.chance()
        .integer(),
      name: 'Banana',
    });
  }

}

@Injectable()
class TestController extends ResourceController<Fruit> {

  constructor(logger: Logger, fruitStore: FruitStore) {
    super(logger, fruitStore);
  }

}

const providers = [
  TestController,
  {provide: FruitStore, useClass: FruitMockStore},
  {provide: Logger, useClass: LoggerMock},
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
];

describe('Resource Controller', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  it('Registers a route to retrieve an entity', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const callStackHandler = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'getOne').callStackHandler;

      const params = new Map();
      params.set('id', 123);

      let request  = new Request(null, params);
      let response = new Response();

      return callStackHandler(request, response)
        .then((finalResponse) => {

          expect(finalResponse.body instanceof Fruit)
            .toBe(true);
          expect(finalResponse.body.getIdentifier())
            .toBe(123);

        });

    })));

  it('Registers a route to delete an entity', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const methodInfo = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'deleteOne');

      expect(methodInfo)
        .toBeDefined(`method info should exist for 'deleteOne'`);

      const params = new Map();
      params.set('id', 123);

      let emitter = new EventEmitter();

      (emitter as any).setEncoding = (): any => null;

      let request  = new Request(emitter as IncomingMessage);
      let response = new Response();

      return (c as any).modelStore.findOne(123)
        .then((fixture: Fruit) => {

          process.nextTick(() => {
            emitter.emit('data', JSON.stringify(fixture));
            emitter.emit('end');
          });

          return methodInfo.callStackHandler(request, response)
            .then((finalResponse) => {

              expect(finalResponse.body instanceof Fruit)
                .toBe(true);
              expect(finalResponse.body.getIdentifier())
                .toBe(123);

            });

        });

    })));

  it('Registers a route to patch an entity', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const methodInfo = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'patchOne');

      expect(methodInfo)
        .toBeDefined(`method info should exist for 'patchOne'`);

      let emitter = new EventEmitter();

      (emitter as any).setEncoding = (): any => null;

      let request  = new Request(emitter as IncomingMessage);
      let response = new Response();

      return (c as any).modelStore.findOne(123)
        .then((fixture: Fruit) => {

          process.nextTick(() => {
            emitter.emit('data', JSON.stringify(fixture));
            emitter.emit('end');
          });

          return methodInfo.callStackHandler(request, response)
            .then((finalResponse) => {

              expect(finalResponse.body instanceof Fruit)
                .toBe(true);
              expect(finalResponse.body.getIdentifier())
                .toBe(123);

            });

        });

    })));

  it('Throws exception when patch is attempted on entity that does not exist', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const methodInfo = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'patchOne');

      expect(methodInfo)
        .toBeDefined(`method info should exist for 'patchOne'`);

      let emitter = new EventEmitter();

      (emitter as any).setEncoding = (): any => null;

      let request  = new Request(emitter as IncomingMessage);
      let response = new Response();

      return (c as any).modelStore.findOne(123)
        .then((fixture: Fruit) => {

          fixture = _.clone(fixture);
          fixture.fruitId = 999; //not in store

          const hasOneSpy = spyOn((c as any).modelStore, 'hasOne').and.callThrough();

          process.nextTick(() => {
            emitter.emit('data', JSON.stringify(fixture));
            emitter.emit('end');
          });

          return methodInfo.callStackHandler(request, response)
            .then((res:Response) => {

              expect(hasOneSpy).toHaveBeenCalledWith(fixture);
              expect(res.body.message).toEqual('NotFoundException: Model with id [999] does not exist');

            });

        });

    })));

  it('Registers a route to retrieve many entities', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const callStackHandler = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'getMany').callStackHandler;

      let request  = new Request();
      let response = new Response();

      return callStackHandler(request, response)
        .then((finalResponse) => {

          expect(finalResponse.body instanceof Collection)
            .toBe(true);
          expect(finalResponse.body[0] instanceof Fruit)
            .toBe(true);
          expect(finalResponse.body[0].name)
            .toBe('Banana');

        });

    })));

  it('Registers a route put one entity', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const callStackHandler = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'putOne').callStackHandler;

      let emitter = new EventEmitter();

      (emitter as any).setEncoding = (): any => null;

      let request  = new Request(emitter as IncomingMessage);
      let response = new Response();

      return (c as any).modelStore.findOne(null)
        .then((fixture: Fruit) => {

          process.nextTick(() => {
            emitter.emit('data', JSON.stringify(fixture));
            emitter.emit('end');
          });

          return callStackHandler(request, response)
            .then((finalResponse) => {

              expect(finalResponse.body instanceof Fruit)
                .toBe(true);
              expect(finalResponse.body)
                .toEqual(fixture);
            });

        });

    })));

});
