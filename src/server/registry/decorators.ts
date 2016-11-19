
import { entityRegistryFunction } from '../../common/registry/decorators';
import { InjectableMiddlewareFactory } from '../middleware/index';

export interface MiddlewareRegistry {
  before: InjectableMiddlewareFactory[];
  after: InjectableMiddlewareFactory[];
}

export interface ControllerMetadata {
  routeBase?:string;
  middleware?: {
    methods: Map<string, MiddlewareRegistry>
    all: MiddlewareRegistry
  }
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
 * @param metadata
 * @returns {ClassDecorator}
 * @constructor
 */
export function Controller(metadata?: ControllerMetadata): ClassDecorator {
  return entityRegistryFunction('controller', metadata);
}
/**
 * @module common
 */
/** End Typedoc Module Declaration */
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
