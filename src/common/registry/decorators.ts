import { registry, EntityType } from './entityRegistry';

function entityRegistryFunction(type: EntityType) {
  return function <TFunction extends Function>(target: TFunction): void {
    registry.register(type, target);
  }
}

export function Model(): ClassDecorator {
  return entityRegistryFunction('model');
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
