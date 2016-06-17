import { Injectable } from '@angular/core';
import * as Sequelize from 'sequelize';
import { QueryOptions } from 'sequelize';
import { Logger } from '../../common/services/logger.service';

/**
 * Core database service for connecting to the SQL db
 */
@Injectable()
export class Database {

  /**
   * The underlying driver that handles the database connection.
   * In this case an instance of Sequelize
   */
  protected driver: Sequelize.Sequelize;
  /**
   * Logger instance for the class, initialized with `database` source
   */
  private logger: Logger;

  constructor(loggerBase: Logger) {

    this.logger = loggerBase.source('database');

    this.logger.info('Connecting to database');
    this.driver = Database.connect((message: string, ...logs: any[]) => this.logger.debug(message, ...logs));

    // const schemaName = process.env.DB_USERNAME;
    //
    // this.createSchema(schemaName).then(() => {
    //
    //   var User = this.driver.define('user', {
    //     username: Sequelize.STRING,
    //     birthday: Sequelize.DATE
    //   }, {
    //     schema: schemaName
    //   });
    //
    //   this.driver.sync().then(() => {
    //     return User.create({
    //       username: 'janedoe',
    //       birthday: new Date(1980, 6, 20)
    //     });
    //   }).then((jane: any) => {
    //     this.logger.info(jane.get({
    //       plain: true
    //     }));
    //   });
    //
    // });
  }

  public static connect(logFunction?:Function):Sequelize.Sequelize {
    return new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
      logging: logFunction,
    });
  }

  /**
   * Retrive the driver instance
   * @returns {Sequelize.Sequelize}
   */
  public getDriver(): Sequelize.Sequelize {
    return this.driver;
  }

  /**
   * Create a new schema in the database
   * @param schemaName
   * @returns {Promise<TResult>}
   */
  public createSchema(schemaName: string): Promise<void> {

    return this.driver.createSchema(schemaName, null)
      .then((result: any) => {
        this.logger.info(`Created Schema [${schemaName}]`, result);
      });

  }

  /**
   * Execute a raw query
   * @param sql
   * @param options
   * @returns {Promise<any>}
   */
  public query(sql: string, options: QueryOptions): Promise<[any[], any]> {
    return this.driver.query(sql, options);
  }

  /**
   * Check there is a connection
   * @returns {Promise<void>}
   */
  public static checkDatabase():Promise<any>{

    return Database.connect().authenticate();
  };

}
