import { registry, EntityType, Entity } from './entityRegistry';
import { Table } from '@ubiquits/typeorm/tables';
import { TableOptions } from '@ubiquits/typeorm/decorator/options/TableOptions';

function entityRegistryFunction(type: EntityType, metadata?:any) {
  return function <TFunction extends Function>(target: TFunction): void {
    registry.register(type, (target as Entity), metadata);
  }
}

/**
 * This decorator extends the Table decorator from @ubiquits/typeorm
 * of the model.
 */
export function Model(storageKey?:string, options?:TableOptions): ClassDecorator {

  const originalDecorator = (Table(storageKey, options) as ClassDecorator);
  const register = entityRegistryFunction('model', {storageKey});

  return function (target: Function) {

    originalDecorator(target);
    register(target);

  }

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
