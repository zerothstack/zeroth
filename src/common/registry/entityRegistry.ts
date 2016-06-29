import * as _ from 'lodash';
import { ModelMetadata, initializeMetadata } from '../metadata/metadata';

export type EntityType = 'model' | 'controller' | 'seeder' | 'middleware' | 'migration' | 'store';
export type EntityMetadata = ModelMetadata /* | <list other metadata types>*/;

export interface RegistryEntityConstructor extends Function {
  __metadata?:EntityMetadata;
  getMetadata?():EntityMetadata;
}

export class EntityRegistry {

  protected registry: Map<EntityType, Map<string, RegistryEntityConstructor>> = new Map();

  constructor() {
  }

  public register(type: EntityType, entity: RegistryEntityConstructor, metadata?:any): this {

    if (!this.registry.get(type)) {
      this.registry.set(type, new Map());
    }

    let typeRegistry = this.registry.get(type);

    if (metadata){
      initializeMetadata(entity);
      _.merge((entity).__metadata, metadata);
    }

    typeRegistry.set(entity.name, entity);

    return this;
  }

  public getAllOfType(type: EntityType): Map<string, RegistryEntityConstructor> {
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

  public findByType(type: EntityType, name: string): RegistryEntityConstructor {
    return this.getAllOfType(type)
      .get(name);
  }

  public findAllWithName(name: string): Map<EntityType, RegistryEntityConstructor> | null {

    let found: Map<EntityType, RegistryEntityConstructor> = new Map();
    this.registry.forEach((entitySet: Map<string, RegistryEntityConstructor>, key: EntityType) => {
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
