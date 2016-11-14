import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Injectable } from '@angular/core';
import Spy = jasmine.Spy;

@Injectable()
export class ServerMock extends Server {

  public getEngine(): any {
    return undefined;
  }

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  protected registerRouteWithEngine(config: RouteConfig): this {
    return this;
  }

  protected initialize(): this {
    return this;
  }

  public startEngine(): Promise<this> {
    return Promise.resolve(this);
  }

  public registerStaticLoader(webroot?: string): this {
    return this;
  }

}
