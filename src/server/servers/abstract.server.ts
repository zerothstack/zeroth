import { IRouteConfiguration } from 'hapi';
import { Injectable } from '@angular/core';
import { RemoteCli } from '../services/remoteCli.service';
import { Logger } from '../../common/services/logger.service';

@Injectable()
export abstract class Server {

  protected logger: Logger;

  constructor(loggerBase: Logger, remoteCli: RemoteCli) {

    this.logger = loggerBase.source('server');

    this.initialize();

    remoteCli.start(3001);
  }

  protected engine: any;

  public abstract register(config: IRouteConfiguration): void;

  protected abstract initialize(): this;

  public abstract start(): Promise<this>;

  public getEngine(): any {
    return this.engine;
  }

}
