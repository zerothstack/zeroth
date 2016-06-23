export type EntityType = 'model' | 'controller' | 'seeder' | 'middleware' | 'migration' | 'store';
export type Entity = Function;

export class EntityRegistry {

  protected registry: Map<EntityType, Map<string, Entity>> = new Map();

  constructor() {
  }

  public register<T extends Entity>(type: EntityType, entity: T): this {

    console.log('registering to type', type, entity);

    if (!this.registry.get(type)) {
      this.registry.set(type, new Map());
    }

    let typeRegistry = this.registry.get(type);

    typeRegistry.set(entity.name, entity);

    return this;
  }

  public getAllOfType(type: EntityType): Map<string, Entity> {
    if (!this.registry.has(type)){
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

  public findByType(type: EntityType, name: string): Entity {
    return this.getAllOfType(type)
      .get(name);
  }

  public findAllWithName(name: string): Map<EntityType, Entity>| null {

    let found: Map<EntityType, Entity> = new Map();
    this.registry.forEach((entitySet: Map<string, Entity>, key: EntityType) => {
      let search = entitySet.get(name);
      if (search) {
        found.set(key, search);
      }
    });

    if (!found.size){
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
