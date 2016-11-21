import { inject, TestBed, async } from '@angular/core/testing';
import { IsolatedMiddlewareFactory } from './index';
import { Request } from '../controllers/request';
import { Response } from '../controllers/response';
import { Route } from '../controllers/route.decorator';
import { AfterAll, BeforeAll, Before, After } from './middleware.decorator';
import { AbstractController } from '../controllers/abstract.controller';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { ServerMock } from '../servers/abstract.server.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { PromiseFactory } from '../../common/util/serialPromise';
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';

let middlewareCalls: string[] = [];

function middlewareFixture(input: string): IsolatedMiddlewareFactory {
  return () => function mockMiddleware(request: Request, response: Response): Response {
    middlewareCalls.push(input);
    return response;
  }
}

@BeforeAll(middlewareFixture('one'), middlewareFixture('two'))
@AfterAll(middlewareFixture('five'))
@Injectable()
class MiddlewareController extends AbstractController {

  constructor(logger: Logger) {
    super(logger);
  }

  @Route('GET', '/test')
  @Before(middlewareFixture('three'))
  @After(middlewareFixture('four'))
  public testMethod(request: Request, response: Response): Response {
    return response;
  }

}

const providers = [
  MiddlewareController,
  {provide: Server, useClass: ServerMock},
  {provide: Logger, useClass: LoggerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
  ReflectiveInjector
];

describe('Middleware Decorators', () => {

  let controller: MiddlewareController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  it('defines registeredMiddleware on the controller',
    inject([MiddlewareController, ReflectiveInjector, Server],
      (c: MiddlewareController, i: ReflectiveInjector, s: Server) => {

        controller = c.registerRoutes(s)
          .registerInjector(i);

        expect(controller.getMetadata().middleware)
          .not
          .toBeNull();
        expect(controller.getMetadata().middleware.all.before.length)
          .toEqual(2);
        expect(controller.getMetadata().middleware.all.after.length)
          .toEqual(1);
      }));

  it('adds middleware to the call stack',
    inject([MiddlewareController, ReflectiveInjector, Server],
      (c: MiddlewareController, i: ReflectiveInjector, s: Server) => {

        controller = c.registerRoutes(s)
          .registerInjector(i);

        const callStack: any = s.getRoutes()
          .reduce((middlewareStackMap: Object, route: RouteConfig) => {
            middlewareStackMap[route.methodName] = route.callStack.map((handler: PromiseFactory<Response>) => handler.name);
            return middlewareStackMap;
          }, {});

        expect(callStack.testMethod)
          .toEqual([
            'mockMiddleware',
            'mockMiddleware',
            'mockMiddleware',
            'testMethod',
            'mockMiddleware',
            'mockMiddleware'
          ]);

      }));

  it('calls the stack in the correct order defined by middleware',
    async(inject([MiddlewareController, ReflectiveInjector, Server],
      (c: MiddlewareController, i: ReflectiveInjector, s: Server) => {

        controller = c.registerRoutes(s)
          .registerInjector(i);

        const callStackHandler: any = s.getRoutes()
          .find((route: RouteConfig) => route.methodName == 'testMethod').callStackHandler;

        let request  = new Request();
        let response = new Response();

        return callStackHandler(request, response)
          .then(() => {

            expect(middlewareCalls)
              .toEqual([
                'one',
                'two',
                'three',
                'four',
                'five',
              ]);

          });

      })));

});
