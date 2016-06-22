import { Injectable } from '@angular/core';
import {
  Model, ModelStatic, identifier,
  UUID
} from '../../common/models/model';
import { Database } from '../services/database.service';
import { Logger } from '../../common/services/logger.service';
import { Store } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';
import { NotFoundException } from '../exeptions/exceptions';
import { Repository } from 'typeorm';

import { Injector } from '@angular/core';
/**
 * This store is for saving and retrieving models from the database using Sequelize
 */
@Injectable()
export abstract class DatabaseStore<T extends Model> extends Store<T> {

  /**
   * The TypeORM repository instance
   */
  protected repository: Repository<T>; //@todo change to reactive repository for RxJS goodness

  /**
   * Logger for the class, initialized with source
   */
  protected logger: Logger;

  protected initialized: Promise<this>;

  constructor(modelStatic: ModelStatic<T>, injector: Injector, protected database: Database, protected loggerBase: Logger) {
    super(modelStatic, injector);
    this.logger     = loggerBase.source('DB Store');
    this.repository = database.getConnection()
      .getRepository<T>(modelStatic);

    this.initialized = database.initialized
      .then(() => this);
  }

  /**
   * Retrieve a record
   * @param id
   * @return {Promise<TResult>}
   */
  public findOne(id: identifier): Promise<T> {
    return this.repository.findOneById(id)
      .catch(() => {
        throw new NotFoundException(`${this.modelStatic.constructor.name} not found for id [${id}]`);
      });
  }

  /**
   * Retrieve a set of records
   * @returns {Promise<Collection<any>>}
   * @param query
   */
  public findMany(query?: any): Promise<Collection<T>> {
    return this.repository.find({
        //@todo define query and restrict count with pagination
      })
      .then((entityArray: T[]): Collection<T> => {

        if (!entityArray.length){
          throw new NotFoundException(`No ${this.modelStatic.constructor.name} found with query params [${JSON.stringify(query)}]`);
        }

        return new Collection(entityArray);
      })
      .catch((e) => {
        this.logger.error(e);
        throw e;
      });
  }

  public saveOne(model: T): Promise<T> {
    return this.repository.persist(model);
  }

}
