import { identifier, ModelStatic, Model } from '../models/model';
import { Collection } from '../models/collection';

export interface Query {

}

export abstract class Store<T extends Model> {

  constructor(protected modelStatic: ModelStatic<T>) {

  }

  public abstract findOne(id: identifier): Promise<T>;

  // public abstract saveOne(model:T): Promise<T>;
  // public abstract deleteOne(id: identifier): Promise<void>;

  public abstract findMany(query?: Query): Promise<Collection<T>>;
  // public abstract saveMany(models:Collection<T>): Promise<Collection<T>>;
  // public abstract deleteMany(models:Collection<T>): Promise<void>;

}
