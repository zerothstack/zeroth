/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { AbstractModel, identifier } from './model';

/**
 * Collection holds an array of [[AbstractModel|models]]. It provides common collection manipulation
 * methods for the controllers, services etc to work with models in an abstracted manner
 */
export class Collection<T extends AbstractModel> extends Array<T> {

  constructor(initialItems?: T[]) {
    super();
    this.push.apply(this, initialItems);
  }

  /**
   * Find an item in the collection by primary identifier
   * @param id
   * @returns {T}
   */
  public findById(id: identifier): AbstractModel {

    const found = this.find((model) => model.getIdentifier() === id);

    if (!found) {
      throw new Error(`Item with id [${id}] not in collection`);
    }

    return found;
  }

}
