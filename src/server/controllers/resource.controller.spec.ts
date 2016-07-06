import { inject, addProviders, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { ResourceController } from './resource.controller';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { AbstractModel, identifier } from '../../common/models/model';
import { ServerMock } from '../servers/abstract.server.spec';
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
];

describe('Resource Controller', () => {

  beforeEach(() => {
    addProviders(providers);
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
