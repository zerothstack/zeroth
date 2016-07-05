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
function entityRegistryFunction(type: EntityType, metadata?: EntityMetadata): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction): void {
    registry.register(type, target.prototype.constructor, metadata);
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
 *  @Controller class decorator for registering class with the [[EntityRegistry]]
 *
 * Example:
 * ```typescript
 *  import { Controller } from '@ubiquits/core/common';
 *  import { AbstractController } from '@ubiquits/core/server';
 *
 *  @Controller()
 *  export class ExampleController extends AbstractController {}
 * ```
 * @returns {ClassDecorator}
 * @constructor
 */
export function Controller(): ClassDecorator {
  return entityRegistryFunction('controller');
}

/**
 *  @Seeder class decorator for registering class with the [[EntityRegistry]]
 *
 * Example:
 * ```typescript
 *  import { Seeder } from '@ubiquits/core/common';
 *  import { AbstractSeeder } from '@ubiquits/core/server';
 *
 *  @Seeder()
 *  export class ExampleSeeder extends AbstractSeeder {}
 * ```
 * @returns {ClassDecorator}
 * @constructor
 */
export function Seeder(): ClassDecorator {
  return entityRegistryFunction('seeder');
}

/**
 *  @Migration class decorator for registering class with the [[EntityRegistry]]
 *
 * Example:
 * ```typescript
 *  import { Migration } from '@ubiquits/core/common';
 *  import { AbstractMigration } from '@ubiquits/core/server';
 *
 *  @Migration()
 *  export class ExampleMigration extends AbstractMigration {}
 * ```
 * @returns {ClassDecorator}
 * @constructor
 */
export function Migration(): ClassDecorator {
  return entityRegistryFunction('migration');
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
