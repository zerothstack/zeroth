import { Injectable } from '@angular/core';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Server as Hapi } from 'hapi';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';
import { PromiseFactory } from '../../common/util/serialPromise';

export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

export interface RouteConfig {
  path: string;
  methodName: string;
  method: HttpMethod;
  callStack: PromiseFactory<Response>[];
  callStackHandler: (request: Request, response: Response) => Promise<Response>;
}

@Injectable()
export abstract class Server {

  public configuredRoutes: RouteConfig[] = [];
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
  public register(config: RouteConfig): this {

    this.configuredRoutes.push(config);
    return this.registerRouteWithEngine(config);
  };

  protected abstract registerRouteWithEngine(config: RouteConfig): this;

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

  public getRoutes(): RouteConfig[] {
    return this.configuredRoutes;
  }

}
