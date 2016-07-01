import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Database } from './database.service';
import { Connection } from 'typeorm';
@Injectable()
export class DatabaseMock extends Database {

  constructor(loggerBase: Logger) {
    super(loggerBase);
  }

  public initialize(): Promise<Connection> {
    return Promise.resolve(null);
  }

}
