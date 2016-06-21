import { identifier, ModelStatic, Model } from '../models/model';
import { Collection } from '../models/collection';
import { Store, Query } from './store';
import {Chance} from 'chance';
import * as _ from 'lodash';

export type ChanceInstance = Chance.Chance;

export abstract class MockStore<T extends Model> extends Store<T> {

  protected chanceInstance: ChanceInstance;

  constructor(modelStatic: ModelStatic<T>) {
    super(modelStatic);
  }

  protected chance(seed?: any): ChanceInstance {
    if (!this.chanceInstance || !!seed) {
      this.chanceInstance = new Chance(seed);
    }
    return this.chanceInstance;
  }

  protected abstract getMock(id?:identifier):T;

  public findOne(id: identifier): Promise<T> {
    return Promise.resolve(this.getMock(id));
  }

  public findMany(query?:any): Promise<Collection<T>> {

    const models = _.times(10, () => this.getMock());

    return Promise.resolve(new Collection(models));
  }

  public saveOne(model:T): Promise<T> {
    return Promise.resolve(model);
  }

}
