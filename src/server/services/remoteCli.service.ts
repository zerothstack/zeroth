import { Logger } from './logger.service';
import { Injectable } from '@angular/core';
import { banner } from '../../common/util/banner';
import Socket = SocketIO.Socket;
const Vantage = require('vantage');

export interface ConnectedSocketCallback {
  (socket: Socket): void;
}

@Injectable()
export class RemoteCli {

  protected vantage: any;
  private logger: Logger;

  constructor(loggerBase: Logger) {

    this.logger = loggerBase.source('remote-cli');

    this.vantage = new Vantage();


    this.vantage.delimiter('ubiquits~$');

    let displayBanner = `Welcome to Ubiquits runtime cli. Type 'help' for commands`;
    if ((<any>process.stdout).columns > 68) {
      displayBanner = `${banner}\n${displayBanner}`;
    }

    this.vantage.banner(displayBanner);

    this.registerCommands();
  }

  private registerCommands(): void {

    let remoteCli = this;

    this.vantage
      .command('foo')
      .description("Outputs 'bar'.")
      .action(function(args: any, callback: any) {
        remoteCli.logger.info('bar');
        this.log('hey there foo');
        callback();
      });
  }

  public start(port: number, callback?: ConnectedSocketCallback): void {

    if (!callback) {
      callback = (socket: Socket) => {
        this.logger.info(`Accepted a connection from [${socket.conn.remoteAddress}]`);
      };
    }

    this.vantage.listen(port, callback);
    this.logger.info(`Vantage server started on ${port}`);
  }

}
