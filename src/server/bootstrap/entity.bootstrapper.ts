import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, ResolvedReflectiveProvider } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { registry, EntityType, RegistryEntityStatic } from '../../common/registry/entityRegistry';

export abstract class EntityBootstrapper {

  protected resolvedEntityProviders: ResolvedReflectiveProvider[];
  protected injector: ReflectiveInjector;
  protected logger: Logger;

  public abstract getResolvedEntities(): ResolvedReflectiveProvider[];

  public invokeBootstrap(injector: ReflectiveInjector): void | Promise<void> {
    this.logger   = injector.get(Logger).source(this.constructor.name);
    this.injector = injector;
    return this.bootstrap();
  }

  protected abstract bootstrap(): void | Promise<void>;

  protected getFromRegistry(type: EntityType): RegistryEntityStatic[] {
    return [
      ...registry.getAllOfType(type)
        .values()
    ];
  }

  protected getResolvedFromRegistry(type: EntityType): ResolvedReflectiveProvider[] {
    this.resolvedEntityProviders = ReflectiveInjector.resolve(this.getFromRegistry(type));
    return this.resolvedEntityProviders;
  }

}
