/**
 * @module server
 */
/** End Typedoc Module Declaration */
import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { registry, EntityType, RegistryEntityStatic } from '../../common/registry/entityRegistry';

/**
 * Provides abstract class for all bootstrappers to extend with, common interface for the
 * bootstrap function to have a single pattern to invoke the bootstrappers
 */
export abstract class EntityBootstrapper {

  /** Array of all entities retrieved from the [[EntityRegistry]] */
  protected entities: RegistryEntityStatic[];
  /** Reference to the Injector instance. Can be set with [[setInjector]]*/
  protected injector: ReflectiveInjector;
  /** Instance of Logger, initialized with the current implementations class name as source */
  protected logger: Logger;

  /**
   * Interface to get all injectable entities. Note that some bootstrappers should simply return
   * an empty array when their entities are not injectable. See [[ModelBootstrapper.getInjectableEntities]]
   * for an example of this.
   */
  public abstract getInjectableEntities(): RegistryEntityStatic[];

  /**
   * Kick off the bootstrapping function. The logger instance is assigned here as the injector is
   * not available at constructor time.
   * @returns {void|Promise<void>}
   */
  public invokeBootstrap(): void | Promise<void> {
    this.logger = this.injector.get(Logger)
      .source(this.constructor.name);
    return this.bootstrap();
  }

  /**
   * Assign the current Injector to the class
   * @param injector
   * @returns {EntityBootstrapper}
   */
  public setInjector(injector: ReflectiveInjector): this {
    this.injector = injector;
    return this;
  }

  /**
   * Resolve & retrieve an instance of the entity from the injector. Note that depending on the
   * provider definition, this could be a different class to the passed token
   * @param token
   * @returns {T}
   */
  protected getInstance<T extends Object>(token: RegistryEntityStatic): T {
    const instance: T = this.injector.get(token);

    this.logger.info(`Resolved ${instance.constructor.name}`);

    return instance;
  }

  /**
   * Run the bootstrap method. If the implementation returns a promise, bootstrapping is halted
   * until the promise resolves. If promise is rejected, bootstrapping is aborted.
   */
  protected abstract bootstrap(): void | Promise<void>;

  /**
   * Retrieve all entities of the given type, converted from Map to Array
   * @param type
   * @returns {any[]}
   */
  protected getFromRegistry(type: EntityType): RegistryEntityStatic[] {
    return [
      ...registry.getAllOfType(type)
        .values()
    ];
  }

  /**
   * Retrieve the entities from the registry.
   *
   * @param type
   * @returns {RegistryEntityStatic[]}
   */
  protected getEntitiesFromRegistry(type: EntityType): RegistryEntityStatic[] {

    // Note the apparent redundancy in assigning `this.entities` is intentional as the `entities`
    // property is used in the `getInjectableEntities` method of some implementations
    this.entities = this.getFromRegistry(type);
    return this.entities;
  }

}
