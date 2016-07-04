import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Database } from './database.service';
import { Service } from '../../common/registry/decorators';

@Injectable()
@Service()
export class DatabaseMock extends Database {

  constructor(loggerBase: Logger) {
    super(loggerBase);
  }

  public initialize(): Promise<this> {
    return Promise.resolve(this);
  }

}
