import { identifier, ModelStatic, Model } from '../models/model';
import {Injector} from '@angular/core';
import { Collection } from '../models/collection';
import { ValidationError} from 'class-validator/ValidationError';
import { ValidationException } from '../../server/exeptions/exceptions';
// we cant import from class-validator as it will get a new instance of MetadataStorage and validation
// will always pass (!)
import {validator, validateAsync, ValidatorOptions} from '../validation';

export interface Query {
}


export abstract class Store<T extends Model> {

  constructor(protected modelStatic: ModelStatic<T>, protected injector:Injector) {
  }

  /**
   * Promise that store is initialized.
   * Override this function for stores that have async initialization like Database stores that
   * require a connection etc.
   * @returns {Promise<Store>}
   */
  public initialized():Promise<this> {
    return Promise.resolve(this);
  }

  public abstract findOne(id: identifier): Promise<T>;

  public abstract saveOne(model:T): Promise<T>;
  // public abstract deleteOne(id: identifier): Promise<void>;

  public abstract findMany(query?: Query): Promise<Collection<T>>;
  // public abstract saveMany(models:Collection<T>): Promise<Collection<T>>;
  // public abstract deleteMany(models:Collection<T>): Promise<void>;

  /**
   * Check the entity passed is valid, if not throw ValidationException with the errors
   * @param model
   * @param validatorOptions
   * @returns {Promise<T>}
   */
  public validate(model:T, validatorOptions?:ValidatorOptions):Promise<T> {

    validator.container = this.injector;

    return validator.validateAsync(model, validatorOptions)
      .catch(e => {
        if (e instanceof ValidationError){
          e = new ValidationException(null, e.errors);
        }
        throw e;
      });
  }

  /**
   * Build the entity from data
   * @param modelData
   * @returns {Promise<T>}
   */
  public hydrate(modelData:any):Promise<T> {
    return Promise.resolve(new this.modelStatic(modelData));
  }

}
