/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { identifier, ModelStatic, AbstractModel } from '../models/model';
import { Injector } from '@angular/core';
import { Collection } from '../models/collection';
import { ValidatorOptions, ValidationError, getValidator, Validator } from '../validation';
import { ValidationException } from '../exceptions/exceptions';

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
  protected validator: Validator;

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

  /**
   * Check if a model exists in the database
   * @param model
   */
  public abstract hasOne(model: T): Promise<boolean>;

  /**
   * Delete the model from the store.
   * @param model
   */
  public abstract deleteOne(model: T): Promise<T>;

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
  public async validate(model: T, validatorOptions?: ValidatorOptions): Promise<T> | never {

    const errors: ValidationError[] = await this.validator.validate(model, validatorOptions);
    if (errors.length) {
      throw new ValidationException(null, errors)
    }
    return model;
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
