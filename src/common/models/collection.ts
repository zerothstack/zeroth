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

    if (initialItems.length){
      this.push.apply(this, initialItems);
    }
  }

  /**
   * Find an item in the collection by primary identifier
   * @param id
   * @returns {T}
   */
  public findById(id: identifier): T {

    const found = this.find((model) => model.getIdentifier() === id);

    if (!found) {
      throw new Error(`Item with id [${id}] not in collection`);
    }

    return found;
  }

  /**
   * Remove an item from the collection
   * @param model
   */
  public remove(model: T): void {
    const index: number = this.findIndex((item: T) => item.getIdentifier() === model.getIdentifier());
    if (index >= 0) {
      this.splice(index, 1);
    }
  }

  /**
   * Check if the collection contains a given model
   * @param model
   * @returns {boolean}
   */
  public contains(model: T): boolean {

    try {
      this.findById(model.getIdentifier());
      return true;
    } catch (e) {
    }
    return false;
  }

}
