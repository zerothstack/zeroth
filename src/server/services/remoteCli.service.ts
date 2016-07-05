import { Injectable, Injector } from '@angular/core';
import { banner } from '../../common/util/banner';
import { Logger } from '../../common/services/logger.service';
import { Server, RouteConfig } from '../servers/abstract.server';
import * as chalk from 'chalk';
import { Response } from '../controllers/response';
import { PromiseFactory } from '../../common/util/serialPromise';
import * as Vantage from 'vantage';
import { Service } from '../../common/registry/decorators';
import { AbstractService } from '../../common/services/service';

const table: Table = require('table').default;

import Socket = SocketIO.Socket;

export interface TableBorderTemplate {

  topBody?: string;
  topJoin?: string;
  topLeft?: string;
  topRight?: string;

  bottomBody?: string;
  bottomJoin?: string;
  bottomLeft?: string;
  bottomRight?: string;

  bodyLeft?: string;
  bodyRight?: string;
  bodyJoin?: string;

  joinBody?: string;
  joinLeft?: string;
  joinRight?: string;
  joinJoin?: string;

}
export interface TableBorderTemplateFactory {
  (name: string): TableBorderTemplate;
}

export interface TableConfig {
  columnDefault?: {
    width?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
  columnCount?: number;
  columns?: {
    [key: number]: {
      width?: number;
      minWidth?: number;
      alignment?: 'center' | 'left' | 'right';
      truncate: number;
      wrapWord: boolean;
    };
  };
  border?: TableBorderTemplate | TableBorderTemplateFactory;
  drawHorizontalLine: (index: number, size: number) => boolean;
  drawJoin: () => boolean;
}

export interface Table {
  (data: any[][], config?: TableConfig): string;
}

export interface ConnectedSocketCallback {
  (socket: Socket): void;
}

/**
 * Class allows developers to register custom commands that can be remote executed in a
 * shell environment. Useful for things like migrations and debugging.
 */
@Injectable()
@Service()
export class RemoteCli extends AbstractService {

  /**
   * The instance of Vantage
   */
  protected vantage: any;
  /**
   * Logger instance for the class, initialized with `remote-cli` source
   */
  private logger: Logger;

  constructor(loggerBase: Logger, private injector: Injector) {
    super();
    this.logger = loggerBase.source('remote-cli');
  }

  /**
   * Initialize the vantage client
   * @returns {RemoteCli}
   */
  public initialize(): this {
    this.vantage = new Vantage();

    this.vantage.delimiter('ubiquits-runtime~$');

    let displayBanner = `Welcome to Ubiquits runtime cli. Type 'help' for commands`;
    if ((<any>process.stdout).columns > 68) {
      displayBanner = `${banner}\n${displayBanner}`;
    }

    this.vantage.banner(displayBanner);

    this.logger.debug('Remote cli initialized');

    return this.registerCommands();
  }

  /**
   * Registers the pre-defined commands
   */
  protected registerCommands(): this {

    let remoteCli = this;

    this.vantage.command('routes')
      .description('outputs route table')
      .action(function (args: any, callback: Function) {

        remoteCli.logger.info('CLI session retrieving routes');

        let server = remoteCli.injector.get(Server);

        const routeTable = server.getRoutes()
          .map((route: RouteConfig) => {

            // @todo break into newlines when 'table' supports it
            const stack = route.callStack.map((handler: PromiseFactory<Response>) => handler.name);

            return [route.method, route.path, stack]
          });

        routeTable.unshift(['Method', 'Path', 'Stack'].map((s: string) => chalk.blue(s)));

        let table = remoteCli.makeTable(routeTable);

        this.log('\n' + table);
        callback();
      });

    return this;
  }

  /**
   * Starts the Vantage server. This is done on start of the server so debugging can start
   * immediately
   * @param port
   * @param callback
   */
  public start(port: number, callback?: ConnectedSocketCallback): this {

    if (!callback) {
      callback = (socket: Socket) => {
        this.logger.info(`Accepted a connection from [${socket.conn.remoteAddress}]`);
      };
    }

    this.vantage.listen(port, callback);
    this.logger.info(`Vantage server started on ${port}`);

    return this;
  }

  /**
   * Constructs table string for output to the cli
   * @see https://github.com/gajus/table
   * @param data
   * @param config
   * @returns {string}
   */
  public makeTable(data: any[][], config?: TableConfig): string {
    return table(data, config);
  }

}
