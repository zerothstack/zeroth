/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Server as Hapi } from 'hapi';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';
import { PromiseFactory } from '../../common/util/serialPromise';
import { Application as Express } from 'express';
import { Server as HttpServer } from 'http';

export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

export interface RouteConfig {
  path: string;
  methodName: string;
  method: HttpMethod;
  callStack: PromiseFactory<Response>[];
  callStackHandler: (request: Request, response: Response) => Promise<Response>;
}

/**
 * Root class that all implementations of server *must* extends. Provides common interface for
 * bootstrapper to handle server startup without caring about underlying implementation
 */
@Injectable()
export abstract class Server {

  /** Hostname eg `localhost`, `example.com` */
  protected host: string;
  /** Port number server is running on */
  protected port: number;

  /** `require('http').Server` object from the base class */
  protected httpServer: HttpServer;

  /** All Configured routes */
  public configuredRoutes: RouteConfig[] = [];

  /** Logger instance for the class, initialized with `server` source */
  protected logger: Logger;

  constructor(loggerBase: Logger, remoteCli: RemoteCli) {

    this.logger = loggerBase.source('server');

    this.host = process.env.APP_HOST || null; //usually should be null to default binding to localhost
    this.port = process.env.APP_PORT || 3000;

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

  /**
   * Register the defined route with the engine
   * @param config
   */
  protected abstract registerRouteWithEngine(config: RouteConfig): this;

  /**
   * Initialization function, called before start is called
   */
  protected abstract initialize(): this;

  /**
   * Kicks off the server using the specific underlying engine
   */
  public abstract startEngine(): Promise<this>;

  /**
   * Register loader with engine to handle static loading of frontend assets
   * @param webroot
   */
  public abstract registerStaticLoader(webroot:string):this;

  /**
   * Kicks off the server
   */
  public start(): Promise<this> {

    this.registerStaticLoader(process.env.WEB_ROOT);

    return this.startEngine();
  };

  /**
   * Retrieves the underlying engine for custom calls
   * @returns {Hapi|any}
   */
  public abstract getEngine(): Hapi|Express|any;

  /**
   * Retrieve the base instance of require('http').Server
   * @returns {HttpServer}
   */
  public getHttpServer() {
    return this.httpServer;
  }

  /**
   * Get the host name (for logging)
   * @returns {string}
   */
  public getHost(): string {
    return `http://${this.host || '(localhost)'}:${this.port}`;
  }

  /**
   * Retrieve all configured routes
   * @returns {RouteConfig[]}
   */
  public getRoutes(): RouteConfig[] {
    return this.configuredRoutes;
  }

  /**
   * Get the default response object
   * @returns {Response}
   */
  protected getDefaultResponse(): Response {

    return new Response()
    // Outputs eg `X-Powered-By: Ubiquits<Angular,Express>`
      .header('X-Powered-By', `Ubiquits<Angular,${this.constructor.name.replace('Server', '')}>`);

  }

}
