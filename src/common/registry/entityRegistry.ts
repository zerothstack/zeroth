/**
 * @module common
 */
/** End Typedoc Module Declaration */
import * as _ from 'lodash';
import { ModelMetadata, initializeMetadata } from '../metadata/metadata';

export type EntityType = 'model' | 'controller' | 'seeder' | 'migration' | 'store' | 'service';
export type EntityMetadata = ModelMetadata /* | <list other metadata types>*/;

export interface RegistryEntityConstructor{
  constructor:RegistryEntityStatic;
}

export interface RegistryEntityStatic extends Function {
  __metadata?:EntityMetadata;
  getMetadata?():EntityMetadata;
}

/**
 * The EntityRegistry is the core register for all entities that are annotated with the entity
 * decorators:
 * * [[Model|@Model]]
 * * [[Controller|@Controller]]
 * * [[Seeder|@Seeder]]
 * * [[Middleware|@Middleware]]
 * * [[Migration|@Migration]]
 * * [[Store|@Store]]
 * * [[Service|@Service]]
 *
 * Both the static classes and any associated metatadata are assigned to the registry by the decorators
 */
export class EntityRegistry {

  /** The internal registry */
  protected registry: Map<EntityType, Map<string, RegistryEntityStatic>> = new Map();

  constructor() {
  }

  /**
   * Associate an entity class with a type and any metadata if present
   * @param type
   * @param entity
   * @param metadata
   * @returns {EntityRegistry}
   */
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

  /**
   * Retrieve all entities associated with the given type
   * @param type
   * @returns {any}
   */
  public getAllOfType(type: EntityType): Map<string, RegistryEntityStatic> {
    if (!this.registry.has(type)) {
      return new Map();
    }
    return this.registry.get(type);
  }

  /**
   * Remove all of a given type
   * @param type
   * @returns {EntityRegistry}
   */
  public clearType(type: EntityType): this {
    this.registry.get(type)
      .clear();
    return this;
  }

  /**
   * Clear the registry
   * @returns {EntityRegistry}
   */
  public clearAll(): this {
    this.registry.clear();
    return this;
  }

  /**
   * Remove a specific entity by type
   * @param type
   * @param name
   * @returns {boolean}
   */
  removeByType(type: EntityType, name: string): boolean {
    return this.getAllOfType(type)
      .delete(name);
  }

  /**
   * Check if an entity is already present in the registry
   * @param type
   * @param name
   * @returns {boolean}
   */
  public hasEntity(type: EntityType, name: string): boolean {

    return !!this.findByType(type, name);
  }

  /**
   * Find an entity given a known type and class name
   * @param type
   * @param name
   * @returns {RegistryEntityStatic}
   */
  public findByType(type: EntityType, name: string): RegistryEntityStatic {
    return this.getAllOfType(type)
      .get(name);
  }

  /**
   * Find all entities with a given class name
   * @param name
   * @returns {any}
   */
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
