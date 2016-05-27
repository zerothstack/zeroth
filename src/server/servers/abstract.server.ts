import { IRouteConfiguration } from 'hapi';

export abstract class Server {

  constructor() {
    this.initialize();
  }

  protected server: any;

  public abstract register(config: IRouteConfiguration): void;

  protected abstract initialize(): this;

  public abstract start(): Promise<this>;

  public getEngine(): any {
    return this.server;
  }

}
