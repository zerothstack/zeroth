import { Collection } from './collection';

import { RegistryEntityConstructor } from '../registry/entityRegistry';
import { RelationType, Relation } from './relations/index';
import { ModelMetadata } from '../metadata/metadata';

export interface EntityNest extends Map<string, BaseModel|Collection<BaseModel>> {

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

export interface ModelConstructor<T extends BaseModel> extends Function {
  constructor: ModelStatic<T>;
}

export interface ModelStatic<T extends BaseModel> extends RegistryEntityConstructor {
  new(data?: any, exists?: boolean): T;
  prototype: T;
}

export abstract class BaseModel {

  public static __metadata: ModelMetadata;

  constructor(data?: any) {
    this.hydrate(data);
  }

  /**
   * Hydrates the model from given data
   * @param data
   * @returns {BaseModel}
   */
  protected hydrate(data: Object) {

    if (!data) {
      return this;
    }

    Object.assign(this, data);
    return this;
  }

  public getIdentifier(): identifier {
    return this[this.getMetadata().identifierKey];
  }

  /**
   * Get the metadata for the model (static side)
   * @returns {ModelMetadata}
   */
  public static getMetadata(): ModelMetadata {
    return this.__metadata;
  }

  /**
   * Get the metadata for the model (instance side)
   * Note this is the same as Model.getMetadata(), but more convenient if you don't know or have
   * access to the model name
   * @returns {ModelMetadata}
   */
  public getMetadata(): ModelMetadata {
    return (this.constructor as ModelStatic<this>).__metadata;
  }

}


