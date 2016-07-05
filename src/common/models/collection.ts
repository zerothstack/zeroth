/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { AbstractModel, identifier } from './model';

export class Collection<T extends AbstractModel> extends Array<T> {

  constructor(initialItems?: T[]) {
    super();
    this.push.apply(this, initialItems);
  }

  public findById(id: identifier): AbstractModel {

    const found = this.find((model) => model.getIdentifier() === id);

    if (!found) {
      throw new Error(`Item with id [${id}] not in collection`);
    }

    return found;
  }

}
