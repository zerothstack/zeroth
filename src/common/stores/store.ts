/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { identifier, ModelStatic, AbstractModel } from '../models/model';
import { Injector } from '@angular/core';
import { Collection } from '../models/collection';
import { ValidationException } from '../../server/exeptions/exceptions';
import { ValidatorOptions, ValidationError, getValidator, Validator } from '../validation';

export interface Query {
}

/**
 * The abstract store should be the root calls for *all* stores, it provides common methods
 * for entity validation and storage.
 */
export abstract class AbstractStore<T extends AbstractModel> {

  /**
   * class-validator Validator instance
   * @see https://github.com/pleerock/class-validator
   */
  protected validator:Validator;

  constructor(protected modelStatic: ModelStatic<T>, protected injector: Injector) {

    this.validator = getValidator(injector);
  }

  /**
   * Promise that store is initialized.
   * Override this function for stores that have async initialization like Database stores that
   * require a connection etc.
   * @returns {Promise<AbstractStore>}
   */
  public initialized(): Promise<this> {
    return Promise.resolve(this);
  }

  /**
   * Find one instance by id
   * @param id
   * @returns {Promise<T>}
   */
  public abstract findOne(id: identifier): Promise<T>;

  /**
   * Save the model. Depending on the implementation, this may be a partial save when the model
   * is known to exist in the store destination and only an update is needed
   * @param model
   * @returns {Promise<T>}
   */
  public abstract saveOne(model: T): Promise<T>;

  // public abstract deleteOne(id: identifier): Promise<void>;

  /**
   * Find multiple entities using a query for constraints
   * @param query
   * @returns {Promise<Collection<T>>}
   */
  public abstract findMany(query?: Query): Promise<Collection<T>>;

  // public abstract saveMany(models:Collection<T>): Promise<Collection<T>>;
  // public abstract deleteMany(models:Collection<T>): Promise<void>;

  /**
   * Check the entity passed is valid, if not throw ValidationException with the errors
   * @param model
   * @param validatorOptions
   * @returns {Promise<T>}
   */
  public validate(model: T, validatorOptions?: ValidatorOptions): Promise<T> {

    return this.validator.validate(model, validatorOptions)
      .then((errors: ValidationError[]) => {
        if (errors.length) {
          throw new ValidationException(null, errors)
        }
        return model;
      });
  }

  /**
   * Build the entity from data
   * @param modelData
   * @returns {Promise<T>}
   */
  public hydrate(modelData: any): Promise<T> {
    return Promise.resolve(new this.modelStatic(modelData));
  }

}
