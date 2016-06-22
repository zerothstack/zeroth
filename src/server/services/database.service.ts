import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { createConnection, CreateConnectionOptions, Connection } from "typeorm";

export interface DatabaseLogFunction {
  (message: any, level: "log"|"debug"|"info"|"error"): void;
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

    this.logger.info('Connecting to database');

    this.initialized = Database.connect((message: any, level: "log"|"debug"|"info"|"error") => this.logger[level](message))
      .then((connection: Connection) => {
        this.connection = connection;

        //@todo if localhost AND requested to sync/reload. Probably will just remove entirely and
        // only run with migrations use SchemaCreatorFactory
        connection.syncSchema(true);

        return connection;
      })
      .catch((e) => {
        this.logger.critical(e);
        throw e;
      });
  }

  public static connect(logFunction?: DatabaseLogFunction): Promise<Connection> {

    const options: CreateConnectionOptions = {
      driver: process.env.DB_DRIVER, // Right now only "mysql" is supported
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoSchemaCreate: true, // if set to true, then database schema will be automatically
                                // created on each application start
        logging: {
          logger: logFunction
        }
      },
      entityDirectories: [
        process.cwd() + '/lib/server/common/models' //@todo make configurable so bootstrap can
                                                    // define relative values
      ],

    };

    return createConnection(options);
  }

  /**
   * Retrieve the driver instance
   * @returns {Sequelize.Sequelize}
   */
  public getConnection(): Connection {
    return this.connection;
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
