import * as _ from 'lodash';
import { ModelMetadata, initializeMetadata } from '../metadata/metadata';

export type EntityType = 'model' | 'controller' | 'seeder' | 'middleware' | 'migration' | 'store';
export type EntityMetadata = ModelMetadata /* | <list other metadata types>*/;

export interface RegistryEntity extends Function {
  __metadata?:EntityMetadata;
  getMetadata?():EntityMetadata;
}

export class EntityRegistry {

  protected registry: Map<EntityType, Map<string, RegistryEntity>> = new Map();

  constructor() {
  }

  public register<T extends RegistryEntity>(type: EntityType, entity: T, metadata?:any): this {

    if (!this.registry.get(type)) {
      this.registry.set(type, new Map());
    }

    let typeRegistry = this.registry.get(type);

    if (metadata){
      initializeMetadata(entity);

      _.merge((entity.constructor as RegistryEntity).__metadata, metadata);

      console.log(entity.constructor, entity.getMetadata());
    }

    typeRegistry.set(entity.name, entity);

    return this;
  }

  public getAllOfType(type: EntityType): Map<string, RegistryEntity> {
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

  public findByType(type: EntityType, name: string): RegistryEntity {
    return this.getAllOfType(type)
      .get(name);
  }

  public findAllWithName(name: string): Map<EntityType, RegistryEntity> | null {

    let found: Map<EntityType, RegistryEntity> = new Map();
    this.registry.forEach((entitySet: Map<string, RegistryEntity>, key: EntityType) => {
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
