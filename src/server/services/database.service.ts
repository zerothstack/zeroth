import { Injectable } from '@angular/core';
import { Logger, LogLevel } from '../../common/services/logger.service';
import { createConnection, CreateConnectionOptions, Connection } from "typeorm";

export interface DatabaseLogFunction {
  (level: LogLevel, ...messages: any[]): void;
}

/**
 * Core database service for connecting to the SQL db
 */
@Injectable()
export class Database {

  /**
   * The underlying driver that handles the database connection.
   * In this case an instance of Sequelize
   */
  protected connection: Connection;
  /**
   * Logger instance for the class, initialized with `database` source
   */
  private logger: Logger;

  /**
   * Promise that the database has initialised. Useful for deferring startup database processes like
   * migrations or schema creations
   */
  public initialized: Promise<Connection>;

  constructor(loggerBase: Logger) {

    this.logger = loggerBase.source('database');

    this.initialized = Database.connect((level: LogLevel, message: any) => this.logger[level](message))
      .then((c) => this.connection = c)
      .catch((e) => {
        this.logger.critical(e);
        throw e;
      });
  }

  public static connect(logFunction?: DatabaseLogFunction): Promise<Connection> {

    logFunction('info', 'Connecting to database');

    const options: CreateConnectionOptions = {
      driver: process.env.DB_DRIVER, // Right now only "mysql" is supported
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoSchemaCreate: false, // if set to true, then database schema will be automatically
                                // created on each application start
        logging: {
          logger: (message: any, level: 'log'|'debug'|'info'|'error'):void => {
            if (level == 'log'){
              level = 'info';
            }
            logFunction((level as LogLevel), message)
          },
          logQueries: true,
        }
      },
      entityDirectories: [
        process.cwd() + '/lib/server/common/models' //@todo make configurable so bootstrap can
                                                    // define relative values
      ],

    };

    logFunction('info', 'reading directories', options.entityDirectories);

    return createConnection(options);
  }

  /**
   * Retrieve the driver instance
   */
  public getConnection(): Promise<Connection> {
    return this.initialized.then(() => this.connection);
  }

  /**
   * Create a new schema in the database (not implemented yet as postgres is pending)
   * @param schemaName
   * @returns {Promise<TResult>}
   */
  // public createSchema(schemaName: string): Promise<void> {}

  /**
   * Execute a raw query
   * @param sql
   * @returns {Promise<any>}
   */
  public query(sql: string): Promise<any> {
    return this.connection.driver.query(sql);
  }

}
