import { Server as Hapi, IRouteConfiguration } from 'hapi';
import { Server } from './abstract.server';

export class HapiServer extends Server {

  protected initialize() {
    this.server = new Hapi();

    this.server.connection({
      host: 'localhost',
      port: 3000
    });
    return this;
  }

  public register(config: IRouteConfiguration): void {
    return this.server.route(config);
  }

  public start(): Promise<this> {
    return this.server.start().then(() => this);
  }

}
