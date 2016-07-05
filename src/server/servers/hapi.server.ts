/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { Server as Hapi, Request as HapiRequest, IReply, Response as HapiResponse } from 'hapi';
import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';

@Injectable()
export class HapiServer extends Server {

  private engine: Hapi;

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  /**
   * @inheritdoc
   * @returns {Hapi}
   */
  public getEngine(): Hapi {
    return this.engine;
  }

  /**
   * @inheritdoc
   * @returns {HapiServer}
   */
  protected initialize() {
    this.engine = new Hapi();

    this.engine.connection({
      host: this.host,
      port: this.port
    });

    this.httpServer = this.engine.listener;

    return this;
  }

  /**
   * @inheritdoc
   * @returns {any}
   * @param routeConfig
   */
  protected registerRouteWithEngine(routeConfig: RouteConfig): this {

    if (/[\*\?]/.test(routeConfig.path)) {
      throw new Error('Hapi syntax for optional or multi-segment parameters is not supported');
    }

    const config = {
      //re-map /path/{param} to /path/{param} (the inverse if needed later is
      // .replace(/{([-_a-zA-Z0-9]+).*?}/g, ':$1')
      path: routeConfig.path.replace(/:(.+?)(\/|$)/g, "{$1}$2"),
      method: routeConfig.method,
      handler: (req: HapiRequest, reply: IReply): Promise<HapiResponse> => {

        let request  = new Request((req.raw.req as any), //typings are incorrect, type should be IncomingMessage
          Request.extractMapFromDictionary<string, string>(req.params),
          Request.extractMapFromDictionary<string, string>(req.headers));
        let response = this.getDefaultResponse();

        return routeConfig.callStackHandler(request, response)
          .then((response: Response) => this.send(response, reply))
          .catch((err:Error) => this.sendErr(err, reply));
      }
    };

    this.engine.route(config);
    return this;
  }

  /**
   * Send the response
   * @param response
   * @param reply
   * @return {HapiResponse}
   */
  protected send(response: Response, reply: IReply): HapiResponse {
    const res = <HapiResponse>reply(response.body);

    res.code(response.statusCode);
    for (var [key, value] of response.headers.entries()) {
      res.header(key, value);
    }

    return res;
  }

  /**
   * Send the error response
   * @param err
   * @param reply
   * @return {HapiResponse}
   */
  protected sendErr(err: Error, reply: IReply): HapiResponse {
    const errorResponse = new Response().data(err);
    const res = this.send(errorResponse, reply);
    //make sure the status is of error type
    if (res.statusCode < 400) {
      res.code(500);
    }
    return res;
  }

  /**
   * @inheritdoc
   * @returns {Promise<HapiServer>}
   */
  public start(): Promise<this> {

    return new Promise((resolve, reject) => {
      this.engine.start((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    })
      .then(() => this);

  }

}
