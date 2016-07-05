/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable, Injector } from '@angular/core';
import { AbstractModel, ModelStatic, identifier } from '../../common/models/model';
import { Database } from '../services/database.service';
import { Logger } from '../../common/services/logger.service';
import { AbstractStore } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';
import { NotFoundException } from '../exeptions/exceptions';
import { Repository, Connection } from 'typeorm';

/**
 * Database store should be extended with a specific implementation for a model. Interacts with
 * TypeORM's repository to handle CRUD with the database
 */
@Injectable()
export abstract class DatabaseStore<T extends AbstractModel> extends AbstractStore<T> {

  /**
   * The TypeORM repository instance
   */
  protected repositoryPromise: Promise<Repository<T>>;

  /**
   * Logger for the class, initialized with source
   */
  protected logger: Logger;

  constructor(modelStatic: ModelStatic<T>, injector: Injector, protected database: Database, protected loggerBase: Logger) {
    super(modelStatic, injector);
    this.logger = loggerBase.source('DB Store');
  }

  /**
   * Retrieve the TypeORM repository for this store's modelStatic.
   * This promise is cached so the same repository instance is always returned
   * @returns {Promise<Repository<T>>}
   */
  public getRepository(): Promise<Repository<T>> {
    if (!this.repositoryPromise) {
      this.repositoryPromise = this.database.getConnection().then((connection: Connection) => connection.getRepository(this.modelStatic))
    }

    return this.repositoryPromise;
  }

  /**
   * @inheritdoc
   */
  public initialized():Promise<this> {
    return this.getRepository().then(() => this);
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
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

  /**
   * @inheritdoc
   */
  public saveOne(model: T): Promise<T> {
    return this.getRepository()
      .then((repo) => repo.persist(model));
  }

}
