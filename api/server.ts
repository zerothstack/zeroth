import {Server as BaseServer, IRouteConfiguration} from 'hapi';
import {IPromise} from "hapi";

export abstract class Server {
  public abstract register(config:IRouteConfiguration):void;
  public abstract start(callback?: (err: any) => void):IPromise<void>;
}

export class HapiServer implements Server {

  private server:BaseServer;

  constructor() {
    this.server = new BaseServer();

    this.server.connection({
      host: 'localhost',
      port: 3000
    });
  }

  public register(config:IRouteConfiguration):void {
    return this.server.route(config);
  }

  public start(callback?: (err: any) => void):IPromise<void> {
    return this.server.start(callback);
  }

  public getHapi():BaseServer {
    return this.server;
  }

}
