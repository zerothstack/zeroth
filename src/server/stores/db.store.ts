/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable, Injector } from '@angular/core';
import { AbstractModel, ModelStatic, identifier } from '../../common/models/model';
import { Database } from '../services/database.service';
import { Logger } from '../../common/services/logger.service';
import { AbstractStore, Query } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';
import { Repository, Connection } from 'typeorm';
import { NotFoundException } from '../../common/exceptions/exceptions';

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
      this.repositoryPromise = this.database.getConnection()
        .then((connection: Connection) => connection.getRepository(this.modelStatic))
    }

    return this.repositoryPromise;
  }

  /**
   * @inheritdoc
   */
  public async initialized(): Promise<this> {
    await this.getRepository();
    return this;
  }

  /**
   * @inheritdoc
   */
  public async findOne(id: identifier): Promise<T> {

    const repo = await this.getRepository();
    const model: T = await repo.findOneById(id);

    if (!model) {
      throw new NotFoundException(`${this.modelStatic.name} not found with id [${id}]`);
    }

    return model;
  }

  /**
   * @inheritdoc
   */
  public async findMany(query?: Query): Promise<Collection<T>> {

    try {
      const repo = await this.getRepository();

      const entityArray: T[] = await repo.find({
        //@todo define query interface and restrict count with pagination
      });

      if (!entityArray.length) {
        throw new NotFoundException(`No ${this.modelStatic.name} found with query params [${JSON.stringify(query)}]`);
      }

      return new Collection(entityArray);

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * @inheritdoc
   */
  public async saveOne(model: T): Promise<T> {
    const repo = await this.getRepository();
    return repo.persist(model);
  }

  /**
   * @inheritdoc
   */
  public async deleteOne(model: T): Promise<T> {
    const repo = await this.getRepository();
    return repo.remove(model);
  }

  /**
   * @inheritdoc
   */
  public async hasOne(model: T): Promise<boolean> {
    const repo = await this.getRepository();
    try {
      await repo.findOneById(model.getIdentifier());
      return true;
    } catch (e) {
      return false;
    }
  }

}
