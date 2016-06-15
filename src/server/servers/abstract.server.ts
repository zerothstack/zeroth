import { Injectable } from '@angular/core';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Server as Hapi, IRouteConfiguration } from 'hapi';

@Injectable()
export abstract class Server {

  /**
   * Logger instance for the class, initialized with `server` source
   */
  protected logger: Logger;
  /**
   * The implementation of the underlying engine, could be hapi, koa, express etc
   */
  protected engine: Hapi|any;

  constructor(loggerBase: Logger, remoteCli: RemoteCli) {

    this.logger = loggerBase.source('server');

    this.initialize();

    remoteCli.start(3001);
  }

  /**
   * Registration function for routes
   * @param config
   */
  public abstract register(config: IRouteConfiguration): void;

  /**
   * Initialization function, called before start is called
   */
  protected abstract initialize(): this;

  /**
   * Kicks off the server
   */
  public abstract start(): Promise<this>;

  /**
   * Retrieves the underlying engine for custom calls
   * @returns {Hapi|any}
   */
  public getEngine(): any {
    return this.engine;
  }

}
