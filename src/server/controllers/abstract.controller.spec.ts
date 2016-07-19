import { inject, addProviders, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { ServerMock } from '../servers/abstract.server.spec';
import { RemoteCli } from '../services/remoteCli.service';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { Request } from './request';
import { Response } from './response';
import { AbstractController } from './abstract.controller';
import { Route } from './route.decorator';
import { UnavailableForLegalReasonsException } from '../exeptions/exceptions';

@Injectable()
class TestController extends AbstractController {

  constructor(logger: Logger) {
    super(logger);
  }

  @Route('GET', '/test')
  public test(request: Request, response: Response): Response {
    return response.data('Hello World');
  }

  @Route('GET', '/http-error')
  public httpError(request: Request, response: Response): Response {
    throw new UnavailableForLegalReasonsException("You can't see that");
  }

  @Route('GET', '/unknown-error')
  public unknownError(request: Request, response: Response): Response {
    throw new Error('Something went terribly wrong');
  }

}

const providers = [
  TestController,
  {provide: Logger, useClass: LoggerMock},
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
];

describe('Controller', () => {

  beforeEach(() => {
    addProviders(providers);
  });

  it('Registers a route that returns a response', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const callStackHandler = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'test').callStackHandler;

      let request  = new Request();
      let response = new Response();

      return callStackHandler(request, response)
        .then((finalResponse) => {

          expect(finalResponse.body)
            .toEqual('Hello World');

        });

    })));

  it('Registers a route that returns an http error response', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const callStackHandler = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'httpError').callStackHandler;

      let request  = new Request();
      let response = new Response();

      return callStackHandler(request, response)
        .then((finalResponse: Response) => {

          expect(finalResponse.statusCode)
            .toEqual(451);

          expect(finalResponse.body)
            .toEqual({message: "UnavailableForLegalReasonsException: You can't see that"});

        });

    })));

  it('Registers a route that falls back to an http error respnse', async(inject([TestController, Server],
    (c: TestController, s: Server) => {

      c.registerRoutes(s);

      const callStackHandler = s.configuredRoutes.find((r: RouteConfig) => r.methodName == 'unknownError').callStackHandler;

      let request  = new Request();
      let response = new Response();

      return callStackHandler(request, response)
        .then((finalResponse: Response) => {

          expect(finalResponse.statusCode)
            .toEqual(500);

          expect(finalResponse.body)
            .toEqual({message: 'InternalServerErrorException: Something went terribly wrong'});

        });

    })));

});
