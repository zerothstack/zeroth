import { Logger } from './logger.service';
import { Injectable } from '@angular/core';
import * as Sequelize from 'sequelize';

@Injectable()
export class Database {

  protected driver: Sequelize.Sequelize;
  private logger: Logger;

  constructor(loggerBase: Logger) {

    this.logger = loggerBase.source('database');

    this.logger.info('Connecting to database');
    this.driver = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      port: process.env.DB_PORT,
      logging: (message:string, ...logs:any[]) => this.logger.debug(message, ...logs),
    });

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

  public createSchema(schemaName: string): Promise<any> {

    return this.driver.createSchema(schemaName, null)
      .then((result: any) => {
        this.logger.info(result);
      })

  }

}
