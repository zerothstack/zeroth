/**
 * @module common
 */
/** End Typedoc Module Declaration */
import * as _ from 'lodash';
import { ModelMetadata, initializeMetadata } from '../metadata/metadata';

export type EntityType = 'model' | 'controller' | 'seeder' | 'middleware' | 'migration' | 'store' | 'service';
export type EntityMetadata = ModelMetadata /* | <list other metadata types>*/;

export interface RegistryEntityConstructor{
  constructor:RegistryEntityStatic;
}

export interface RegistryEntityStatic extends Function {
  __metadata?:EntityMetadata;
  getMetadata?():EntityMetadata;
}

export class EntityRegistry {

  protected registry: Map<EntityType, Map<string, RegistryEntityStatic>> = new Map();

  constructor() {
  }

  public register(type: EntityType, entity: RegistryEntityStatic, metadata?:any): this {

    if (!this.registry.get(type)) {
      this.registry.set(type, new Map());
    }

    let typeRegistry = this.registry.get(type);

    if (metadata){
      initializeMetadata(entity.prototype);
      _.merge(entity.__metadata, metadata);
    }

    typeRegistry.set(entity.name, entity);

    return this;
  }

  public getAllOfType(type: EntityType): Map<string, RegistryEntityStatic> {
    if (!this.registry.has(type)) {
      return new Map();
    }
    return this.registry.get(type);
  }

  public clearType(type: EntityType): this {
    this.registry.get(type)
      .clear();
    return this;
  }

  public clearAll(): this {
    this.registry.clear();
    return this;
  }

  removeByType(type: EntityType, name: string): boolean {
    return this.getAllOfType(type)
      .delete(name);
  }

  public hasEntity(type: EntityType, name: string): boolean {

    return !!this.findByType(type, name);
  }

  public findByType(type: EntityType, name: string): RegistryEntityStatic {
    return this.getAllOfType(type)
      .get(name);
  }

  public findAllWithName(name: string): Map<EntityType, RegistryEntityStatic> | null {

    let found: Map<EntityType, RegistryEntityStatic> = new Map();
    this.registry.forEach((entitySet: Map<string, RegistryEntityStatic>, key: EntityType) => {
      let search = entitySet.get(name);
      if (search) {
        found.set(key, search);
      }
    });

    if (!found.size) {
      return null;
    }

    return found;
  }

}

/**
 * Export default registry as singleton so any implementer gets the same instance
 * @type {EntityRegistry}
 */
export const registry = new EntityRegistry();
