/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { registry, EntityType, EntityMetadata } from './entityRegistry';
import { ModelMetadata } from '../metadata/metadata';

/**
 * Common decorator factory function to simplify decorator declarations
 * @param type
 * @param metadata
 * @returns {function(TFunction): void}
 */
export function entityRegistryFunction(type: EntityType, metadata?: EntityMetadata): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction): void {
    registry.register(type, target, metadata);
  }
}

/**
 *  @Model decorator for registering class with the [[EntityRegistry]]
 *
 * class Example:
 * ```typescript
 *
 *  @Model()
 *  export class ExampleModel extends AbstractModel {}
 *  import { Model, AbstractModel } from '@ubiquits/core/common';
 * ```
 * @param metadata
 * @returns {ClassDecorator}
 * @constructor
 */
export function Model(metadata?: ModelMetadata): ClassDecorator {
  return entityRegistryFunction('model', metadata);
}

/**
 *  @Store class decorator for registering class with the [[EntityRegistry]]
 *
 * Example:
 * ```typescript
 *  import { Store, AbstractStore } from '@ubiquits/core/common';
 *
 *  @Store()
 *  export class ExampleStore extends AbstractStore<any> {}
 * ```
 * @returns {ClassDecorator}
 * @constructor
 */
export function Store(): ClassDecorator {
  return entityRegistryFunction('store');
}

/**
 *  @Service class decorator for registering class with the [[EntityRegistry]]
 *
 * Example:
 * ```typescript
 *  import { Service, AbstractService } from '@ubiquits/core/common';
 *
 *  @Service()
 *  export class ExampleService extends AbstractService {}
 * ```
 * @returns {ClassDecorator}
 * @constructor
 */
export function Service(): ClassDecorator {
  return entityRegistryFunction('service');
}
