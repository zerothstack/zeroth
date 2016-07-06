/**
 * @module common
 */
/** End Typedoc Module Declaration */
import * as _ from 'lodash';
import { ModelMetadata, initializeMetadata, ControllerMetadata } from '../metadata/metadata';
import { ControllerBootstrapper } from '../../server/bootstrap/controllers.bootstrapper';

export type EntityType = 'model' | 'controller' | 'seeder' | 'migration' | 'store' | 'service';
export type EntityMetadata = ModelMetadata | ControllerMetadata;

export interface RegistryEntityConstructor<M>{
  constructor:RegistryEntityStatic<M>;
}

export interface RegistryEntityStatic<M> extends Function {
  __metadata?:M;
  getMetadata?():M;
}

export class RegistryEntity<M> {
  constructor(){}
  /** The metadata associated with the class instance */
  public static __metadata: EntityMetadata;
  /** The default metadata associated with the class instance */
  public static __metadataDefault: EntityMetadata;

  /**
   * Get the metadata for the model (static side)
   * @returns {ModelMetadata}
   */
  public static getMetadata(): EntityMetadata {

    const metadata = this.__metadata;
    if (metadata || !this.__metadataDefault){
      return metadata;
    }

    return this.__metadataDefault;
  }

  /**
   * Get the metadata for the model (instance side)
   * Note this is the same as Model.getMetadata(), but more convenient if you don't know or have
   * access to the model name
   * @returns {ModelMetadata}
   */
  public getMetadata(): M {
    return (this.constructor as RegistryEntityStatic<M>).getMetadata();
  }
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
  protected registry: Map<EntityType, Map<string, RegistryEntityStatic<EntityMetadata>>> = new Map();

  constructor() {
  }

  /**
   * Associate an entity class with a type and any metadata if present
   * @param type
   * @param entity
   * @param metadata
   * @returns {EntityRegistry}
   */
  public register(type: EntityType, entity: RegistryEntityStatic<EntityMetadata>, metadata?:any): this {

    if (!this.registry.get(type)) {
      this.registry.set(type, new Map());
    }

    let typeRegistry = this.registry.get(type);

    if (metadata){
      initializeMetadata(entity);
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
  public getAllOfType(type: EntityType): Map<string, RegistryEntityStatic<EntityMetadata>> {
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
  public findByType(type: EntityType, name: string): RegistryEntityStatic<EntityMetadata> {
    return this.getAllOfType(type)
      .get(name);
  }

  /**
   * Find all entities with a given class name
   * @param name
   * @returns {any}
   */
  public findAllWithName(name: string): Map<EntityType, RegistryEntityStatic<EntityMetadata>> | null {

    let found: Map<EntityType, RegistryEntityStatic<EntityMetadata>> = new Map();
    this.registry.forEach((entitySet: Map<string, RegistryEntityStatic<EntityMetadata>>, key: EntityType) => {
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
