import { BaseCollection } from './base.collection';

export interface EntityNest extends Map<string, AbstractModel|BaseCollection<AbstractModel>> {

}

export abstract class AbstractModel {

  protected nestedEntities: EntityNest;

  protected identifier: symbol;

  public getIdentifier(): string|number|symbol {
    return this[this.identifier];
  }

}
