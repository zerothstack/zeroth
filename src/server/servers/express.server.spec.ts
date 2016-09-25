import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { TestBed, inject, async } from '@angular/core/testing';
import { LoggerMock } from '../../common/services/logger.service.mock';
import * as proxyquire from 'proxyquire';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';

describe('Express Server', () => {

  const expressConstructorSpy = jasmine.createSpy('expressConstructor');
  const expressSpy            = jasmine.createSpyObj('express', ['get', 'use']);

  expressConstructorSpy.and.returnValue(expressSpy);

  const httpCreateServerSpy = jasmine.createSpy('httpCreateServer');
  const httpServerSpy       = jasmine.createSpyObj('httpServer', ['listen']);
  httpServerSpy.listen      = jasmine.createSpy('httpServerListener');

  httpCreateServerSpy.and.returnValue(httpServerSpy);

  const mockedModule = proxyquire('./express.server', {
    express: expressConstructorSpy,
    http: {
      createServer: httpCreateServerSpy
    }
  });

  const providers = [
    {
      provide: Server,
      deps: [Logger, RemoteCli],
      useFactory: (logger: Logger, cli: RemoteCli) => {
        return new mockedModule.ExpressServer(logger, cli);
      }
    },
    {provide: Logger, useClass: LoggerMock},
    {provide: RemoteCli, useClass: RemoteCliMock},
    {provide: AuthService, useClass: AuthServiceMock},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  afterEach(() => {
    delete process.env.WEB_ROOT;
  });

  it('initialized http server with new express instance', inject([Server], (server: Server) => {

    expect(expressConstructorSpy)
      .toHaveBeenCalled();
    expect(httpCreateServerSpy)
      .toHaveBeenCalled();

    expect(server.getEngine())
      .toEqual(expressSpy);

  }));

  it('kicks off an http server when started', async(inject([Server], (server: Server) => {

    const startPromise = server.start()
      .then((res) => {

        expect(res)
          .toEqual(server);
      });

    expect(httpServerSpy.listen)
      .toHaveBeenCalledWith((server as any).port, (server as any).host, jasmine.any(Function));

    const startedCallback = httpServerSpy.listen.calls.mostRecent().args[2];
    startedCallback(); //resolve the promise
    return startPromise;

  })));

  it('registers routes with the engine, and dispatches calls to the express engine', async(inject([Server], (server: Server) => {

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

    expect(expressSpy.get)
      .toHaveBeenCalledWith(routeConfig.path, jasmine.any(Function));

    const registrationCallback = expressSpy.get.calls.mostRecent().args[1];

    const reqSpy = jasmine.createSpy('req')
      .and
      .returnValue({
        params: {
          id: 1,
        },
        header: {
          Authorization: 'Bearer: Banana'
        }
      });

    const resSpy  = jasmine.createSpyObj('res', ['status', 'send', 'header']);
    resSpy.status = jasmine.createSpy('res_status');
    resSpy.send   = jasmine.createSpy('res_send');
    resSpy.header = jasmine.createSpy('res_send');

    return registrationCallback(reqSpy, resSpy)
      .then(() => {
        expect(callStackHandlerSpy)
          .toHaveBeenCalledWith(jasmine.any(Request), jasmine.any(Response));
        expect(resSpy.status)
          .toHaveBeenCalledWith(200);
        expect(resSpy.send)
          .toHaveBeenCalledWith(responseFixture.body);
        expect(resSpy.header)
          .toHaveBeenCalledWith('Content-Length', '11');
      });

  })));

  it('registers routes with the engine, and dispatches errors to the express engine', async(inject([Server], (server: Server) => {

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

    expect(expressSpy.get)
      .toHaveBeenCalledWith(routeConfig.path, jasmine.any(Function));

    const registrationCallback = expressSpy.get.calls.mostRecent().args[1];

    const reqSpy = jasmine.createSpy('req')
      .and
      .returnValue({
        params: null,
        header: null
      });

    const resSpy      = jasmine.createSpyObj('res', ['status', 'send', 'header']);
    resSpy.status     = jasmine.createSpy('res_status');
    resSpy.send       = jasmine.createSpy('res_send');
    resSpy.header     = jasmine.createSpy('res_send');
    resSpy.statusCode = 200;

    return registrationCallback(reqSpy, resSpy)
      .then(() => {
        expect(callStackHandlerSpy)
          .toHaveBeenCalledWith(jasmine.any(Request), jasmine.any(Response));
        expect(resSpy.status)
          .toHaveBeenCalledWith(500);
        expect(resSpy.send)
          .toHaveBeenCalledWith(responseFixture);
      });

  })));

  it('registers static file loader when started', async(inject([Server], (server: Server) => {

    process.env.WEB_ROOT = '/tmp/example';

    expressConstructorSpy['static'] = jasmine.createSpy('express_static');

    const startPromise = server.start()
      .then((res) => {

        expect(res)
          .toEqual(server);

        expect(expressConstructorSpy['static'])
          .toHaveBeenCalledWith('/tmp/example', {index: ['index.html']});

      });

    const startedCallback = httpServerSpy.listen.calls.mostRecent().args[2];
    startedCallback(); //resolve the promise
    return startPromise;

  })));

});


