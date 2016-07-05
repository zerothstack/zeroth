/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';
import * as express from 'express';
import { Application, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import * as http from 'http';

@Injectable()
export class ExpressServer extends Server {

  protected engine: Application;

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  /**
   * @inheritdoc
   * @returns {Application}
   */
  public getEngine(): Application {
    return this.engine;
  }

  /**
   * @inheritdoc
   * @returns {Express}
   */
  protected initialize() {
    this.engine     = express();
    this.httpServer = http.createServer(<any>(this.engine));

    return this;
  }

  /**
   * @inheritdoc
   * @returns {any}
   * @param routeConfig
   */
  protected registerRouteWithEngine(routeConfig: RouteConfig): this {

    this.engine[routeConfig.method.toLowerCase()](routeConfig.path, (req: ExpressRequest, res: ExpressResponse) => {

      let request = new Request(req,
        Request.extractMapFromDictionary<string, string>(req.params),
        Request.extractMapFromDictionary<string, string>(req.headers));

      let response = this.getDefaultResponse();

      return routeConfig.callStackHandler(request, response)
        .then((response: Response) => {
          return this.send(response, res);
        })
        .catch((err:Error) => this.sendErr(err, res));

    });

    return this;
  }

  /**
   * @inheritdoc
   * @returns {Promise<ExpressServer>}
   */
  public start(): Promise<this> {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.port, this.host, resolve);
    })
      .then(() => this);
  }

  /**
   * Send the response
   * @param response
   * @param res
   */
  protected send(response: Response, res: ExpressResponse): void {
    res.status(response.statusCode);

    for (var [key, value] of response.headers.entries()) {
      res.header(key, value);
    }

    res.send(response.body);
  }

  /**
   * Send the error response
   * @param err
   * @param res
   */
  protected sendErr(err: Error, res: ExpressResponse): void {
    //make sure the status is of error type
    if (res.statusCode < 400) {
      res.status(500);
    }

    res.send(err);
  }
}
