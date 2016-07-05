import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Database } from './database.service';
import { Service } from '../../common/registry/decorators';

/**
 * Provides no-side effect mock for Database for use in testing fixtures
 */
@Injectable()
@Service()
export class DatabaseMock extends Database {

  constructor(loggerBase: Logger) {
    super(loggerBase);
  }

  /**
   * Mock initialization, doesn't connect to the database. This means calls to
   * `(new DatabaseMock).getConnection()` will return `Promise<void>`
   * @returns {Promise<DatabaseMock>}
   */
  public initialize(): Promise<this> {
    return Promise.resolve(this);
  }

}
