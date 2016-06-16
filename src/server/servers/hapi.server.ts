import { Injectable } from '@angular/core';
import { Server as Hapi } from 'hapi';
import { Request as HapiRequest, IReply, Response as HapiResponse } from 'hapi';
import { Server, RouteConfig } from './abstract.server';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';
import { IRoute } from 'hapi';

@Injectable()
export class HapiServer extends Server {

  private engine: Hapi;

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  /**
   * @inherit
   * @returns {Hapi}
   */
  public getEngine(): Hapi {
    return this.engine;
  }

  /**
   * @inherit
   * @returns {HapiServer}
   */
  protected initialize() {
    this.engine = new Hapi();

    this.engine.connection({
      host: this.host,
      port: this.port
    });
    return this;
  }

  /**
   * @inherit
   * @returns {any}
   * @param routeConfig
   */
  protected registerRouteWithEngine(routeConfig: RouteConfig): this {

    const config = {
      path: routeConfig.path,
      method: routeConfig.method,
      handler: (req: HapiRequest, reply: IReply): Promise<HapiResponse> => {

        let request  = new Request(req);
        let response = new Response();

        return routeConfig.callStackHandler(request, response)
          .then((response: Response) => {
            this.logger.debug('Responding with', response);
            const res = <HapiResponse>reply(response.body);

            res.code(response.statusCode);
            for (var [key, value] of response.headers.entries()) {
              res.header(key, value);
            }
            return res;
          })
          .catch((err) => reply(err));
      }
    };

    this.engine.route(config);
    return this;
  }

  /**
   * @inherit
   * @returns {Promise<HapiServer>}
   */
  public start(): Promise<this> {

    return new Promise((resolve, reject) => {
      this.engine.start((err) => {
        if (err){
          return reject(err);
        }
        return resolve();
      });
    })
      .then(() => this);

  }

}
