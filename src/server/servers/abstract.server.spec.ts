import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerMock extends Server {

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  protected registerRouteWithEngine(config: RouteConfig): this {
    return this;
  }

  protected initialize(): this {
    return this;
  }

  public start(): Promise<this> {
    return Promise.resolve(this);
  }

}
