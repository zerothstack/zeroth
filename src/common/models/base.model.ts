import { BaseCollection } from './base.collection';

export interface EntityNest extends Map<string, BaseModel|BaseCollection<BaseModel>> {

}

export type identifier = string | number | symbol;
export type uuid = string;

export interface ModelStatic<T extends BaseModel> {
  new(data?: any, exists?: boolean): T;
}

export interface TypeCaster {
  (value: any, reference:BaseModel): any;
}

export interface RelationHydrator {
  (modelCollection: Object | Object[], reference:BaseModel): BaseModel|BaseCollection<BaseModel>;
}

export abstract class BaseModel {
  protected nestedEntities: EntityNest;

  protected identifierKey: identifier;

  /**
   * Don't set these properties directly - they are defined by the model property decorators
   */
  protected __typeCasts: Map<string, TypeCaster>;
  protected __relations: Map<string, RelationHydrator>;

  /**
   * References maintained from initial hydration
   */
  protected __rawData: Object;
  protected __original: Object;

  constructor(data?: any) {
    this.hydrate(data);
  }

  protected hydrate(data: Object) {

    this.__rawData = Object.assign({}, data);

    if (this.__typeCasts) {
      for (const [key, caster] of this.__typeCasts) {
        if (data.hasOwnProperty(key)) {
          data[key] = caster(data[key], this); //cast type
        }
      }
    }

    if (this.__relations) {
      for (const [key, relationHydrator] of this.__relations) {
        if (data.hasOwnProperty(key)) {
          data[key] = relationHydrator(data[key], this); //hydrate nested relations
        }
      }
    }

    this.__original = Object.assign({}, data);

    Object.assign(this, data);
  }

  public getIdentifier(): identifier {
    return this[this.identifierKey];
  }

}

export function primary(target: any, propertyKey: string) {
  target.identifierKey = propertyKey;
}

