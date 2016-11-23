/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { Logger, LogLevel } from '../../common/services/logger.service';
import { createConnection, ConnectionOptions, Connection, Driver } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { EntityRegistry } from '../../common/registry/entityRegistry';
import { Service } from '../../common/registry/decorators';
import { AbstractService } from '../../common/services/service';
import * as SQL from 'sql-template-strings';

export type TypeormLogLevel = "log" | "info" | "warn" | "error";

export interface DatabaseLogFunction {
  (level: LogLevel, ...messages: any[]): void;
}

/**
 * Core database service for connecting to the SQL db
 */
@Injectable()
@Service()
export class Database extends AbstractService {

  private static connections: Map<string, Connection> = new Map();

  /**
   * Logger instance for the class, initialized with `database` source
   */
  private logger: Logger;

  /**
   * Promise that the database has initialised.
   */
  private initialized: Promise<this>;

  constructor(loggerBase: Logger) {
    super();
    this.logger = loggerBase.source('database');

    this.initialized = this.initialize();
  }

  /**
   * Connects to the database and stores reference to the connection instance
   * @returns {Promise<Database>}
   */
  public async initialize(): Promise<this> {
    try {
      await Database.connect(undefined, (level: LogLevel, message: any) => this.logger[level](message))
    } catch (e) {
      this.logger.critical(e);
      throw e;
    }

    return this;
  }

  /**
   * Connect to the database, returning promised of connection instance.
   * Static method so calls can be made outside of dependency injection context for example
   * pre-bootstrap
   * @param name
   * @param logFunction
   * @returns {Promise<Connection>}
   */
  public static async connect(name: string = 'default', logFunction?: DatabaseLogFunction): Promise<Connection> {

    if (this.connections.has(name)){
      return this.connections.get(name);
    }

    let logger: (level: string, message: any) => void;

    if (logFunction) {
      logFunction('info', 'Connecting to database');

      //remap log levels to zeroth' keys
      logger = (level: TypeormLogLevel | LogLevel, message: any): void => {

        switch (level) {
          case 'log':
            level = 'info';
            break;

          case 'warn':
            level = 'warning';
            break;
        }
        logFunction(level, message)
      };
    }

    const options: ConnectionOptions = {
      name,
      driver: {
        type: process.env.DB_DRIVER, // Right now only 'mysql' is supported
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        usePool: false,
      },
      // created on each application start
      logging: {
        logQueries: true,
        logger,
      },
      autoSchemaSync: false, // if set to true, then database schema will be automatically
      entities: [
        ...EntityRegistry.root.getAllOfType('model')
          .values()
      ],
    };

    const connection = await createConnection(options);

    this.connections.set(name, connection);

    // await connection.driver.createQueryRunner();

    return connection;
  }

  public static clearConnections(): void {
    this.connections.clear();
  }

  /**
   * Retrieve connection instance
   * @returns {Promise<Connection>}
   */
  public async getConnection(name: string = 'default'): Promise<Connection> {
    await this.initialize();

    return Database.connections.get(name);
  }

  /**
   * Execute a raw query
   * @param sql
   * @returns {Promise<any>}
   */
  public async query(sql: string): Promise<any> {
    return (await this.getQueryRunner()).query(sql);
  }

  /**
   * Get current driver from connection for direct database interaction
   * @returns {Promise<Driver>}
   */
  public async getDriver(connectionName: string = 'default'): Promise<Driver> {
    return (await this.getConnection(connectionName)).driver;
  }

  /**
   * Get current query runner from current driver for direct database interaction
   * @returns {Promise<QueryRunner>}
   */
  public async getQueryRunner(connectionName: string = 'default'): Promise<QueryRunner> {
    return (await this.getDriver(connectionName)).createQueryRunner()
  }

  /**
   * ES6 template string tagger to create prepared statements
   *
   * Example:
   * ```typescript
   * return this.database.query(Database.prepare`INSERT
   * INTO    books
   * (name, author, isbn, category, recommended_age, pages, price)
   * VALUES  (${name}, ${author}, ${isbn}, ${category}, ${recommendedAge}, ${pages}, ${price})
   * `);
   * ```
   * This will generate a prepared statement with all the safety features that come with that
   * @see https://www.npmjs.com/package/sql-template-strings
   * @param args
   * @returns {any}
   */
  public static prepare(...args:any[]):any {
    return (SQL as any)(...args);
  }
}

