import { Collection } from './collection';
import { DataTypeAbstract } from 'sequelize';

export interface EntityNest extends Map<string, Model|Collection<Model>> {

}

export type identifier = string | number | symbol;

/**
 * Helper class for differentiating string keys with uuid keys
 */
export class UUID extends String {
  constructor(value?: any) {
    super(value);
  }
}

export interface ModelSchema {
//@todo define schema (separate to sequelize definition)
}

export interface ModelStatic<T extends Model> {
  new(data?: any, exists?: boolean): T;
  identifierKey: string;
  schema: ModelSchema;
  modelName: string;
  storedProperties: Map<string, string>;
}

export interface TypeCaster {
  (value: any, reference: Model): any;
}

export interface RelationHydrator {
  (modelCollection: Object | Object[], reference: Model): Model|Collection<Model>;
}

export abstract class Model {
  protected nestedEntities: EntityNest;

  public static identifierKey: string;
  public static schema: ModelSchema = {};
  public static storedProperties: Map<string, string>;
  public static modelName: string;

  /**
   * Don't set these properties directly - they are defined by the model property decorators
   */
  protected __typeCasts: Map<string, TypeCaster>;
  protected __relations: Map<string, RelationHydrator>;

  /**
   * References maintained from initial hydration
   */

  constructor(data?: any) {
    this.hydrate(data);
  }

  /**
   * Hydrates the model from given data
   * @param data
   * @returns {Model}
   */
  protected hydrate(data: Object) {

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

    Object.assign(this, data);
    return this;
  }

  public getIdentifier(): identifier {
    const self = <typeof Model>this.constructor;
    return this[self.identifierKey];
  }

}


