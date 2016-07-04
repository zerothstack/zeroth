import * as proxyquire from 'proxyquire';
import { Injector } from '@angular/core';
import { RemoteCli } from './remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { addProviders, inject } from '@angular/core/testing';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { registry } from '../../common/registry/entityRegistry';
import { Server, RouteConfig } from '../servers/abstract.server';
import { ServerMock } from '../servers/abstract.server.spec';
import { RemoteCliMock } from './remoteCli.service.mock';

import Spy = jasmine.Spy;

describe('Remote Commands', () => {

  const vantageSpy = jasmine.createSpyObj('vantage', [
    'delimiter', 'banner', 'command', 'description', 'action', 'listen'
  ]);

  //support chaining
  vantageSpy.command.and.returnValue(vantageSpy);
  vantageSpy.description.and.returnValue(vantageSpy);
  vantageSpy.action.and.returnValue(vantageSpy);

  const vantageConstructorSpy = jasmine.createSpy('vantageConstructor')
    .and
    .returnValue(vantageSpy);
  const tableSpy              = jasmine.createSpy('table');

  const mockedModule = proxyquire('./remoteCli.service', {
    vantage: vantageConstructorSpy,
    table: tableSpy,
  });

  const providers = [
    {
      provide: RemoteCli,
      deps: [Logger, Injector],
      useFactory: (logger: Logger, injector: Injector) => {
        return new mockedModule.RemoteCli(logger, injector).initialize();
      }
    },
    {provide: Logger, useClass: LoggerMock},
    {provide: Server, useClass: ServerMock},
  ];

  beforeEach(() => {
    addProviders(providers);
  });

  beforeEach(() => {
    registry.clearAll();
    (process.stdout as any).columns = 90;
  });

  it('initializes cli with vantage', inject([RemoteCli], (cli: RemoteCli) => {

    expect(vantageConstructorSpy)
      .toHaveBeenCalled();
    expect(vantageSpy.delimiter)
      .toHaveBeenCalledWith('ubiquits-runtime~$');
    expect(vantageSpy.banner)
      .toHaveBeenCalledWith(jasmine.stringMatching('Welcome to Ubiquits runtime cli'));

  }));

  it('starts a vantage server', inject([RemoteCli], (cli: RemoteCli) => {

    cli.start(1234);

    expect(vantageSpy.listen)
      .toHaveBeenCalledWith(1234, jasmine.any(Function));

    const callbackLogFunction = vantageSpy.listen.calls.mostRecent().args[1];

    const loggerSpy = spyOn((cli as any).logger, 'persistLog');
    callbackLogFunction({conn: {remoteAddress: '127.0.0.1'}});

    expect(loggerSpy)
      .toHaveBeenCalledWith('info', [`Accepted a connection from [127.0.0.1]`]);

  }));

  it('registers route table output action on startup', inject([RemoteCli, Server], (cli: RemoteCli, server: Server) => {

    expect(vantageSpy.action)
      .toHaveBeenCalledWith(jasmine.any(Function));

    const mockRoute: RouteConfig = {
      path: '/test',
      methodName: 'test',
      method: 'GET',
      callStack: [
        function beforeMiddleware(): any {
        },
        function test(): any {
        },
        function afterMiddleware(): any {
        },
      ],
      callStackHandler: null
    };

    spyOn(server, 'getRoutes')
      .and
      .returnValue([mockRoute]);

    const actionFunction = vantageSpy.action.calls.mostRecent().args[0];
    const actionLogSpy   = jasmine.createSpy('action_logger');

    const boundAction = actionFunction.bind({
      log: actionLogSpy
    });

    const makeTableSpy = spyOn(cli, 'makeTable')
      .and
      .callThrough();

    boundAction(null, (): void => null);

    expect(makeTableSpy)
      .toHaveBeenCalled();

    const tableArg = makeTableSpy.calls.mostRecent().args[0];
    expect(tableArg[0].toString())
      .toContain('Method');
    expect(tableArg[1])
      .toEqual(['GET', '/test', ['beforeMiddleware', 'test', 'afterMiddleware']]);

    expect(actionLogSpy)
      .toHaveBeenCalled();

  }));

});

describe('Remote Command Mock', () => {

  const providers = [
    RemoteCliMock,
    {provide: Logger, useClass: LoggerMock},
    {provide: Server, useClass: ServerMock},
  ];

  beforeEach(() => {
    addProviders(providers);
  });

  it('mocks the interfaces of RemoteCli', inject([RemoteCliMock], (cli: RemoteCliMock) => {

    const spy = spyOn(cli, 'registerCommands')
      .and
      .callThrough();

    const start = cli.initialize()
      .start(1234);

    expect(start)
      .toEqual(cli);

    expect(spy)
      .toHaveBeenCalled();

  }));

});
