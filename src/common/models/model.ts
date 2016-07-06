/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { RegistryEntityStatic, RegistryEntity } from '../registry/entityRegistry';
import { ModelMetadata } from '../metadata/metadata';

export type identifier = string | number | symbol;

/**
 * Helper class for differentiating string keys with uuid keys
 */
export class UUID extends String {
  constructor(value?: any) {
    super(value);
  }
}

export interface ModelConstructor<T extends AbstractModel> extends Function {
  constructor: ModelStatic<T>;
}

export interface ModelStatic<T extends AbstractModel> extends RegistryEntityStatic<ModelMetadata> {
  new(data?: any, exists?: boolean): T;
  prototype: T;
}

/**
 * Common abstract class that **all** models must extend from. Provides common interfaces for other
 * services to interact with without knowing about the concrete implementation
 */
export abstract class AbstractModel extends RegistryEntity<ModelMetadata> {

  constructor(data?: any) {
    super();
    this.hydrate(data);
  }

  /**
   * Hydrates the model from given data
   * @param data
   * @returns {AbstractModel}
   */
  protected hydrate(data: Object) {

    if (!data) {
      return this;
    }

    Object.assign(this, data);
    return this;
  }

  /**
   * Get the primary identifier of the model
   * @returns {any}
   */
  public getIdentifier(): identifier {
    return this[this.getMetadata().identifierKey];
  }

}


