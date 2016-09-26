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

  protected app: Application;

  constructor(logger: Logger, remoteCli: RemoteCli) {
    super(logger, remoteCli);
  }

  /**
   * @inheritdoc
   * @returns {Application}
   */
  public getEngine(): Application {
    return this.app;
  }

  /**
   * @inheritdoc
   * @returns {Express}
   */
  protected initialize() {
    this.app        = express();
    this.httpServer = http.createServer(<any>(this.app));

    return this;
  }

  /**
   * @inheritdoc
   * @returns {any}
   * @param routeConfig
   */
  protected registerRouteWithEngine(routeConfig: RouteConfig): this {

    this.app[routeConfig.method.toLowerCase()](routeConfig.path, (req: ExpressRequest, res: ExpressResponse) => {

      let request = new Request(req,
        Request.extractMapFromDictionary<string, string>(req.params),
        Request.extractMapFromDictionary<string, string>(req.headers));

      let response = this.getDefaultResponse();

      return routeConfig.callStackHandler(request, response)
        .then((response: Response) => {
          return this.send(response, res);
        })
        .catch((err: Error) => this.sendErr(err, res));

    });

    return this;
  }

  /**
   * @inheritDoc
   */
  public registerStaticLoader(webroot?: string): this {
    if (webroot) {
      this.app.use(express.static(webroot, {index: ['index.html']}));
    }

    //@todo resolve how to load webpacked modules with angular/universal

    // const ngApp = (req:ExpressRequest, res:ExpressResponse) => {
    //   let baseUrl = '/';
    //   let url = req.originalUrl || '/';
    //
    //   let config: ExpressEngineConfig = {
    //     directives: frontendComponents,//[ App ],
    //
    //     // dependencies shared among all requests to server
    //     platformProviders: [
    //       {provide: ORIGIN_URL, useValue: this.getHost()},
    //       {provide: BASE_URL, useValue: baseUrl},
    //     ],
    //
    //     // dependencies re-created for each request
    //     providers: [
    //       {provide: REQUEST_URL, useValue: url},
    //       // provideRouter(routes),
    //       NODE_LOCATION_PROVIDERS,
    //       NODE_HTTP_PROVIDERS,
    //     ],
    //
    //     // if true, server will wait for all async to resolve before returning response
    //     async: true,
    //
    //     // if you want preboot, you need to set selector for the app root
    //     // you can also include various preboot options here (explained in separate document)
    //     preboot: false // { appRoot: 'app' }
    //   };
    //
    //   res.render('index', config);
    // };
    //
    // this.app.engine('.html', expressEngine);
    // this.app.set('views', process.env.WEB_ROOT);
    // this.app.set('view engine', 'html');
    // this.app.use(express.static(process.env.WEB_ROOT, {index: false}));
    // this.app.get('/', ngApp);

    return this;
  }

  /**
   * @inheritdoc
   * @returns {Promise<ExpressServer>}
   */
  public startEngine(): Promise<this> {
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
