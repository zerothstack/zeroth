import { registry, EntityType, RegistryEntity, EntityMetadata } from './entityRegistry';
import { ModelMetadata } from '../metadata/metadata';

function entityRegistryFunction(type: EntityType, metadata?:EntityMetadata) {
  return function <TFunction extends Function>(target: TFunction): void {
    registry.register(type, (target as RegistryEntity), metadata);
  }
}

export function Model(metadata?:ModelMetadata): ClassDecorator {

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
