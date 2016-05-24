import { BaseCollection } from './base.collection';

export interface EntityNest extends Map<string, AbstractModel|BaseCollection<AbstractModel>> {

}

export abstract class AbstractModel extends Map {

  protected nestedEntities: EntityNest;

  protected identifier: Symbol;

  public getIdentifier() {
    return this.get(this.identifier);
  }




}
