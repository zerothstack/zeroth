import { inject, addProviders, async } from '@angular/core/testing';
import { Request } from '../controllers/request';
import { Response } from '../controllers/response';
import { Route } from '../controllers/route.decorator';
import { Before } from './middleware.decorator';
import { AbstractController } from '../controllers/abstract.controller';
import { Injectable, Injector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { ServerMock } from '../servers/abstract.server.spec';
import { RemoteCli } from '../services/remoteCli.service';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { debugLog, DebugLogMiddleware } from './debugLog.middleware';

@Injectable()
class MiddlewareController extends AbstractController {

  constructor(logger: Logger) {
    super(logger);
  }

  @Route('GET', '/test')
  @Before(debugLog('test log input'))
  public testMethod(request: Request, response: Response): Response {
    return response;
  }

}

let source: string, logs: any[] = [];

let mockLogger = {
  source: (input: string) => {
    source = input;
    return mockLogger;
  },
  debug: (input: string) => {
    logs.push(input);
  }
};

const providers: any[] = [
        MiddlewareController,
        {provide: Server, useClass: ServerMock},
        {provide: Logger, useClass: LoggerMock},
        {provide: RemoteCli, useClass: RemoteCliMock},
        {
          provide: DebugLogMiddleware,
          deps: [],
          useFactory: () => {
            return new DebugLogMiddleware(<Logger>mockLogger)
          },
        }
      ]
  ;

describe('debugLog middleware', () => {

  let controller: MiddlewareController;

  beforeEach(() => {
    addProviders(providers);
  });

  it('Calls debug.log on the passed value to the middleware decorator',
    async(inject([MiddlewareController, Injector, Server],
      (c: MiddlewareController, i: Injector, s: Server) => {

        controller = c.registerInjector(i)
          .registerRoutes(s);

        const callStackHandler: any = s.getRoutes()
          .find((route: RouteConfig) => route.methodName == 'testMethod').callStackHandler;

        let request  = new Request();
        let response = new Response();

        return callStackHandler(request, response)
          .then(() => {

            expect(source)
              .toEqual('debugLog');
            expect(logs)
              .toEqual(['test log input']);

          });

      })));

});
