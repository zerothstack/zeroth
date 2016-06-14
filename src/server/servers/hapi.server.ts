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

  /**
   * @inherit
   * @returns {HapiServer}
   */
  protected initialize() {
    this.engine = new Hapi();

    this.engine.connection({
      host: 'localhost',
      port: 3000
    });
    return this;
  }

  /**
   * @inherit
   * @param config
   * @returns {any}
   */
  public register(config: IRouteConfiguration): void {
    return this.engine.route(config);
  }

  /**
   * @inherit
   * @returns {IThenable<HapiServer>|PromiseLike<HapiServer>|Promise<HapiServer>|IPromise<HapiServer>}
   */
  public start(): Promise<this> {
    return this.engine.start().then(() => this);
  }

}
