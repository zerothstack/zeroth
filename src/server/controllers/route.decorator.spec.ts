import { inject, TestBed } from '@angular/core/testing';
import { Request } from '../controllers/request';
import { Response } from '../controllers/response';
import { AbstractController } from '../controllers/abstract.controller';
import { Injectable, Injector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { ServerMock } from '../servers/abstract.server.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { Route } from './route.decorator';
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';
import { Controller } from '../registry/decorators';

@Injectable()
@Controller({
  routeBase: 'base'
})
class TestController extends AbstractController {

  constructor(logger: Logger) {
    super(logger);
  }

  @Route('PUT', '/test/:id')
  public testMethod(request: Request, response: Response): any {
  }

}

const providers = [
  TestController,
  {provide: Server, useClass: ServerMock},
  {provide: Logger, useClass: LoggerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
];

describe('@Route decorator', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  it('Registers a route definition with the server ',
    inject([TestController, Injector, Server],
      (c: TestController, i: Injector, s: Server) => {

        let controller = c.registerInjector(i)
          .registerRoutes(s);

        const routeConfig: RouteConfig = s.getRoutes()
          .find((route: RouteConfig) => route.methodName == 'testMethod');

        expect(routeConfig.method)
          .toEqual('PUT');
        expect(routeConfig.path)
          .toEqual(process.env.API_BASE + '/base/test/:id');

      }));

});
