import { Injectable } from '@angular/core';
import { Server as Hapi, IRouteConfiguration } from 'hapi';
import { Server } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';

@Injectable()
export class HapiServer extends Server {

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  protected initialize() {
    this.engine = new Hapi();

    this.engine.connection({
      host: 'localhost',
      port: 3000
    });
    return this;
  }

  public register(config: IRouteConfiguration): void {
    return this.engine.route(config);
  }

  public start(): Promise<this> {
    return this.engine.start().then(() => this);
  }

}
