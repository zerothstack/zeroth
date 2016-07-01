import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { beforeEachProviders, inject, it } from '@angular/core/testing';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { RemoteCliMock } from '../services/remoteCli.service.spec';
import * as proxyquire from 'proxyquire';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';

describe('Hapi Server', () => {

  const hapiConstructorSpy = jasmine.createSpy('hapiConstructor');
  const hapiSpy            = jasmine.createSpyObj('hapi', ['start', 'connection', 'route']);

  hapiConstructorSpy.and.returnValue(hapiSpy);

  const mockedModule = proxyquire('./hapi.server', {
    hapi: {
      Server: hapiConstructorSpy
    },
  });

  const providers = [
    {
      provide: Server, deps: [Logger, RemoteCli], useFactory: (logger: Logger, cli: RemoteCli) => {
      return new mockedModule.HapiServer(logger, cli);
    }
    },
    {provide: Logger, useClass: LoggerMock},
    {provide: RemoteCli, useClass: RemoteCliMock},
  ];

  beforeEachProviders(() => providers);

  it('initialized http server with new hapi instance', inject([Server], (server: Server) => {

    expect(hapiConstructorSpy)
      .toHaveBeenCalled();

    expect(hapiSpy.connection)
      .toHaveBeenCalledWith({port: (server as any).port, host: (server as any).host});
    expect(server.getEngine())
      .toEqual(hapiSpy);

  }));

  it('kicks off an http server when started', inject([Server], (server: Server) => {

    const startPromise = server.start()
      .then((res) => {

        expect(res)
          .toEqual(server);
      });

    expect(hapiSpy.start)
      .toHaveBeenCalled();
    const startCallback = hapiSpy.start.calls.mostRecent().args[0];

    startCallback();

    return startPromise;
  }));

  it('rejects promise when server start fails', inject([Server], (server: Server) => {

    const startPromise = server.start();

    expect(hapiSpy.start)
      .toHaveBeenCalled();
    const startCallback = hapiSpy.start.calls.mostRecent().args[0];

    const errorFixture = new Error('something went wrong');
    startCallback(errorFixture);

    return startPromise.catch((e) => {
      expect(e)
        .toEqual(errorFixture);
    });
  }));

  it('throws error when invalid route is set', inject([Server], (server: Server) => {

    const routeConfig: RouteConfig = {
      path: '/test/optional?',
      methodName: 'test',
      method: 'GET',
      callStack: [],
      callStackHandler: null
    };

    const expectedError = () => server.register(routeConfig);

    expect(expectedError)
      .toThrowError('Hapi syntax for optional or multi-segment parameters is not supported');

    expect(hapiSpy.route)
      .not
      .toHaveBeenCalled();
  }));

  it('registers routes with the engine, and dispatches calls to the hapi engine', inject([Server], (server: Server) => {

    const callStackHandlerSpy = jasmine.createSpy('callStackHandler');
    const responseFixture     = new Response().data('Hello World')
      .header('Content-Length', '11');

    callStackHandlerSpy.and.returnValue(Promise.resolve(responseFixture));

    const routeConfig: RouteConfig = {
      path: '/test',
      methodName: 'test',
      method: 'GET',
      callStack: [],
      callStackHandler: callStackHandlerSpy
    };

    server.register(routeConfig);

    expect(hapiSpy.route)
      .toHaveBeenCalledWith({
        path: routeConfig.path,
        method: 'GET',
        handler: jasmine.any(Function)
      });

    const registrationCallback = hapiSpy.route.calls.mostRecent().args[0].handler;

    const reqFixture: any = {
      params: {
        id: 1,
      },
      headers: {
        Authorization: 'Bearer: Banana'
      },
      raw: {
        req: null
      }
    };

    const resSpy   = jasmine.createSpyObj('res', ['code', 'header']);
    const replySpy = jasmine.createSpy('reply')
      .and
      .returnValue(resSpy);

    return registrationCallback(reqFixture, replySpy)
      .then((response: any) => {
        expect(callStackHandlerSpy)
          .toHaveBeenCalledWith(jasmine.any(Request), jasmine.any(Response));
        expect(resSpy.code)
          .toHaveBeenCalledWith(200);
        expect(resSpy.header)
          .toHaveBeenCalledWith('Content-Length', '11');
        expect(replySpy)
          .toHaveBeenCalledWith(responseFixture.body);

        expect(response)
          .toEqual(resSpy);

      });

  }));

  it('registers routes with the engine, and dispatches errors to the hapi engine', inject([Server], (server: Server) => {

    const callStackHandlerSpy = jasmine.createSpy('callStackHandler');
    const responseFixture     = new Error('Internal error');
    callStackHandlerSpy.and.returnValue(Promise.reject(responseFixture));

    const routeConfig: RouteConfig = {
      path: '/test',
      methodName: 'test',
      method: 'GET',
      callStack: [],
      callStackHandler: callStackHandlerSpy
    };

    server.register(routeConfig);

    expect(hapiSpy.route)
      .toHaveBeenCalledWith({
        path: routeConfig.path,
        method: 'GET',
        handler: jasmine.any(Function)
      });

    const registrationCallback = hapiSpy.route.calls.mostRecent().args[0].handler;

    const reqFixture: any = {
      params: null,
      headers: null,
      raw: {
        req: null
      }
    };

    const resSpy      = jasmine.createSpyObj('res', ['code', 'header']);
    const replySpy    = jasmine.createSpy('reply')
      .and
      .returnValue(resSpy);
    resSpy.statusCode = 200;

    return registrationCallback(reqFixture, replySpy)
      .then((response: any) => {
        expect(callStackHandlerSpy)
          .toHaveBeenCalledWith(jasmine.any(Request), jasmine.any(Response));
        expect(resSpy.code)
          .toHaveBeenCalledWith(500);

        expect(response)
          .toEqual(resSpy);

      });

  }));

});


