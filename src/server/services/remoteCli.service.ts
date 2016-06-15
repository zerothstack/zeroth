import { Injectable, Injector } from '@angular/core';
import { banner } from '../../common/util/banner';
import Socket = SocketIO.Socket;
import { Logger } from '../../common/services/logger.service';
import { Server, RouteInfo } from '../servers/abstract.server';
import * as chalk from 'chalk';
const Vantage = require('vantage');

export interface ConnectedSocketCallback {
  (socket: Socket): void;
}

/**
 * Class allows developers to register custom commands that can be remote executed in a
 * shell environment. Useful for things like migrations and debugging.
 */
@Injectable()
export class RemoteCli {

  /**
   * The instance of Vantage
   */
  protected vantage: any;
  /**
   * Logger instance for the class, initialized with `remote-cli` source
   */
  private logger: Logger;

  constructor(loggerBase: Logger, private injector: Injector) {

    this.logger = loggerBase.source('remote-cli');

    this.vantage = new Vantage();

    this.vantage.delimiter('ubiquits-runtime~$');

    let displayBanner = `Welcome to Ubiquits runtime cli. Type 'help' for commands`;
    if ((<any>process.stdout).columns > 68) {
      displayBanner = `${banner}\n${displayBanner}`;
    }

    this.vantage.banner(displayBanner);

    this.registerCommands();
  }

  /**
   * Registers the pre-defined commands
   */
  private registerCommands(): void {

    let remoteCli = this;

    this.vantage
      .command('foo')
      .description("Outputs 'bar'.")
      .action(function (args: any, callback: Function) {
        remoteCli.logger.info('bar');
        this.log('hey there foo');
        callback();
      });

    this.vantage.command('routes')
      .description('outputs route table')
      .action(function (args: any, callback: Function) {

        remoteCli.logger.info('CLI session retrieving routes');

        let server = remoteCli.injector.get(Server);

        const routeTable = server.getRoutes().map((route:RouteInfo) => [route.method, route.path]);

        routeTable.unshift(['Method', 'Path'].map((s: string) => chalk.blue(s)));

        let table = remoteCli.logger.makeTable(routeTable);

        this.log('\n' + table);
        callback();
      });
  }

  /**
   * Starts the Vantage server. This is done on start of the server so debugging can start immediately
   * @param port
   * @param callback
   */
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
