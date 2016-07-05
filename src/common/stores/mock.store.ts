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

export type ChanceInstance = Chance.Chance;

/**
 * Provides abstract class to build concrete mock stores which can create new mock instances of
 * models.
 */
export abstract class MockStore<T extends AbstractModel> extends AbstractStore<T> {

  /**
   * Instance of chancejs
   * @see http://chancejs.com
   */
  protected chanceInstance: ChanceInstance;

  constructor(modelStatic: ModelStatic<T>, injector:Injector) {
    super(modelStatic, injector);
  }

  /**
   * Retrieve instance of chance, optionally providing a seed for the internal mersenne twister to
   * get repeatable random data
   * @param seed
   * @returns {ChanceInstance}
   */
  protected chance(seed?: any): ChanceInstance {
    if (!this.chanceInstance || !!seed) {
      this.chanceInstance = new Chance(seed);
    }
    return this.chanceInstance;
  }

  /**
   * Get an instance of the model
   * @param id
   */
  protected abstract getMock(id?:identifier):T;

  /**
   * @inheritdoc
   */
  public findOne(id?: identifier): Promise<T> {
    return Promise.resolve(this.getMock(id));
  }

  /**
   * @inheritdoc
   */
  public findMany(query?:any): Promise<Collection<T>> {

    const models = _.times(10, () => this.getMock());

    return Promise.resolve(new Collection(models));
  }

  /**
   * Mock saving the model
   *
   * As saving does not make sense for a mock store, this just stubs the interface by returning
   * the model in a resolved promise
   */
  public saveOne(model:T): Promise<T> {
    return Promise.resolve(model);
  }

}
