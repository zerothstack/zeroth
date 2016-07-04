import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, ResolvedReflectiveProvider, NoProviderError } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { registry, EntityType, RegistryEntityStatic } from '../../common/registry/entityRegistry';

export abstract class EntityBootstrapper {

  protected entities: RegistryEntityStatic[];
  protected injector: ReflectiveInjector;
  protected logger: Logger;

  public abstract getInjectableEntities(): RegistryEntityStatic[];

  public invokeBootstrap(): void | Promise<void> {
    this.logger = this.injector.get(Logger)
      .source(this.constructor.name);
    return this.bootstrap();
  }

  public setInjector(injector: ReflectiveInjector): this {
    this.injector = injector;
    return this;
  }

  protected getInstance<T extends Object>(entity: RegistryEntityStatic): T {
    const instance: T = this.injector.get(entity);

    this.logger.info(`Resolved ${instance.constructor.name}`);

    return instance;
  }

  protected abstract bootstrap(): void | Promise<void>;

  protected getFromRegistry(type: EntityType): RegistryEntityStatic[] {
    return [
      ...registry.getAllOfType(type)
        .values()
    ];
  }

  protected getEntitiesFromRegistry(type: EntityType): RegistryEntityStatic[] {
    this.entities = this.getFromRegistry(type);
    return this.entities;
  }

}
