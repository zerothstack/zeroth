import { it, inject, beforeEachProviders, expect, describe } from '@angular/core/testing';
import { Request } from '../controllers/request';
import { Response } from '../controllers/response';
import { AbstractController } from '../controllers/abstract.controller';
import { Injectable, Injector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { ServerMock } from '../servers/abstract.server.spec';
import { RemoteCli } from '../services/remoteCli.service';
import { RemoteCliMock } from '../services/remoteCli.service.spec';
import { Route } from './route.decorator';
import { RouteBase } from './routeBase.decorator';

@Injectable()
@RouteBase('base')
class TestController extends AbstractController {

  constructor(server: Server, logger: Logger) {
    super(server, logger);
  }

  @Route('PUT', '/test/:id')
  public testMethod(request: Request, response: Response): Response {
    return response;
  }

}

const providers = [
  TestController,
  {provide: Server, useClass: ServerMock},
  {provide: Logger, useClass: LoggerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
];

describe('@Route & @RouteBase decorators', () => {

  beforeEachProviders(() => providers);

  it('Registers a route definition with the server ',
    inject([TestController, Injector, Server],
      (c: TestController, i: Injector, s: Server) => {

        let controller = c.registerInjector(i)
          .registerRoutes();

        const routeConfig: RouteConfig = s.getRoutes()
          .find((route: RouteConfig) => route.methodName == 'testMethod');

        expect(routeConfig.method)
          .toEqual('PUT');
        expect(routeConfig.path)
          .toEqual(process.env.API_BASE + '/base/test/:id');

      }));

});
