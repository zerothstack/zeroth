/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { identifier, ModelStatic, AbstractModel } from '../models/model';
import { Collection } from '../models/collection';
import { AbstractStore } from './store';
import { Injector } from '@angular/core';
import { Chance } from 'chance';
import * as _ from 'lodash';

/**
 * Provides abstract class to build concrete mock stores which can create new mock instances of
 * models.
 */
export abstract class MockStore<T extends AbstractModel> extends AbstractStore<T> {

  /**
   * Instance of chancejs
   * @see http://chancejs.com
   */
  protected chanceInstance: Chance.Chance;

  protected modelCollection: Collection<T>;

  constructor(modelStatic: ModelStatic<T>, injector: Injector) {
    super(modelStatic, injector);

    this.initializeMockCollection();
  }

  /**
   * Start the mock store off with some dummy data
   */
  protected initializeMockCollection(): void {
    const models         = _.times(10, () => this.getMock());
    this.modelCollection = new Collection(models);
  }

  /**
   * Retrieve instance of chance, optionally providing a seed for the internal mersenne twister to
   * get repeatable random data
   * @param seed
   * @returns {ChanceInstance}
   */
  protected chance(seed?: any): Chance.Chance {
    if (!this.chanceInstance || !!seed) {
      this.chanceInstance = new Chance(seed);
    }
    return this.chanceInstance;
  }

  /**
   * Get an instance of the model
   * @param id
   */
  protected abstract getMock(id?: identifier): T;

  /**
   * @inheritdoc
   */
  public findOne(id?: identifier): Promise<T> {
    try {
      return Promise.resolve(this.modelCollection.findById(id));
    } catch (e){
      return this.saveOne(this.getMock(id))
    }
  }

  /**
   * @inheritdoc
   */
  public findMany(query?: any): Promise<Collection<T>> {
    return Promise.resolve(this.modelCollection);
  }

  /**
   * Mock saving the model
   *
   * As saving does not make sense for a mock store, this just stubs the interface by returning
   * the model in a resolved promise
   */
  public saveOne(model: T): Promise<T> {
    this.modelCollection.push(model);
    return Promise.resolve(model);
  }

  /**
   * Mock selecting model by id
   *
   * As deleting does not make sense for a mock store, this just stubs the interface by returning
   * the model in a resolved promise
   * @param model
   * @returns {Promise<void>}
   */
  public deleteOne(model: T): Promise<T> {
    this.modelCollection.remove(model);
    return Promise.resolve(model);
  }

  /**
   * @inheritdoc
   */
  public hasOne(model: T): Promise<boolean> {
    return Promise.resolve(this.modelCollection.contains(model));
  }

}
