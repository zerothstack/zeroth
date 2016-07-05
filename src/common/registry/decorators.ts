/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { registry, EntityType, EntityMetadata } from './entityRegistry';
import { ModelMetadata } from '../metadata/metadata';

function entityRegistryFunction(type: EntityType, metadata?: EntityMetadata): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction): void {
    registry.register(type, target.prototype.constructor, metadata);
  }
}

export function Model(metadata?: ModelMetadata): ClassDecorator {

  return entityRegistryFunction('model', metadata);
}

export function Controller(): ClassDecorator {
  return entityRegistryFunction('controller');
}

export function Seeder(): ClassDecorator {
  return entityRegistryFunction('seeder');
}

export function Middleware(): ClassDecorator {
  return entityRegistryFunction('middleware');
}

export function Migration(): ClassDecorator {
  return entityRegistryFunction('migration');
}

export function Store(): ClassDecorator {
  return entityRegistryFunction('store');
}
export function Service(): ClassDecorator {
  return entityRegistryFunction('service');
}
