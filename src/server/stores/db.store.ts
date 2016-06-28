import { Injectable } from '@angular/core';
import {
  BaseModel, ModelStatic, identifier,
  UUID
} from '../../common/models/model';
import { Database } from '../services/database.service';
import { Logger } from '../../common/services/logger.service';
import { BaseStore } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';
import { NotFoundException } from '../exeptions/exceptions';
import { Repository } from '@ubiquits/typeorm';
import { Connection } from '@ubiquits/typeorm/backend';

import { Injector } from '@angular/core';
/**
 * This store is for saving and retrieving models from the database using Sequelize
 */
@Injectable()
export abstract class DatabaseStore<T extends BaseModel> extends BaseStore<T> {

  /**
   * The TypeORM repository instance
   */
  protected repositoryPromise: Promise<Repository<T>>; //@todo change to reactive repository for
                                                       // RxJS goodness

  /**
   * Logger for the class, initialized with source
   */
  protected logger: Logger;

  constructor(modelStatic: ModelStatic<T>, injector: Injector, protected database: Database, protected loggerBase: Logger) {
    super(modelStatic, injector);
    this.logger = loggerBase.source('DB Store');
  }

  public getRepository(): Promise<Repository<T>> {
    if (!this.repositoryPromise) {
      this.repositoryPromise = this.database.initialized.then((connection: Connection) => connection.getRepository(this.modelStatic))
    }

    return this.repositoryPromise;
  }

  /**
   * @inherit
   * @returns {Promise<DatabaseStore>}
   */
  public initialized():Promise<this> {
    return this.getRepository().then(() => this);
  }

  /**
   * Retrieve a record
   * @param id
   * @return {Promise<TResult>}
   */
  public findOne(id: identifier): Promise<T> {
    return this.getRepository()
      .then((repo) => repo.findOneById(id))
      .then((model:T) => {
        if (!model){
          throw new NotFoundException(`${this.modelStatic.name} not found with id [${id}]`);
        }
        return model;
      });
  }

  /**
   * Retrieve a set of records
   * @returns {Promise<Collection<any>>}
   * @param query
   */
  public findMany(query?: any): Promise<Collection<T>> {
    return this.getRepository()
      .then((repo) => repo.find({
        //@todo define query and restrict count with pagination
      }))
      .then((entityArray: T[]): Collection<T> => {

        if (!entityArray.length) {
          throw new NotFoundException(`No ${this.modelStatic.name} found with query params [${JSON.stringify(query)}]`);
        }

        return new Collection(entityArray);
      })
      .catch((e) => {
        this.logger.error(e);
        throw e;
      });
  }

  public saveOne(model: T): Promise<T> {
    return this.getRepository()
      .then((repo) => repo.persist(model));
  }

}
