import { Injectable } from '@angular/core';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Server as Hapi } from 'hapi';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';
import { PromiseFactory } from '../../common/util/serialPromise';
import { Application as Express } from 'express';
import {Server as HttpServer} from 'http';

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

  protected host:string;
  protected port:number;
  
  protected httpServer:HttpServer;

  public configuredRoutes: RouteConfig[] = [];
  /**
   * Logger instance for the class, initialized with `server` source
   */
   protected logger: Logger;

  constructor(loggerBase: Logger, remoteCli: RemoteCli) {

    this.logger = loggerBase.source('server');

    //@todo pull this config from process.env via .env variables
    this.host = 'localhost';
    this.port = 3000;

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
  public abstract getEngine():Hapi|Express|any;

  public getHttpServer(){
    return this.httpServer;
  }

  public getHost():string{
    return `http://${this.host}:${this.port}`;
  }

  public getRoutes(): RouteConfig[] {
    return this.configuredRoutes;
  }

}
