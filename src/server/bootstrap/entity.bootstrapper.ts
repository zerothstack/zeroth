import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, ResolvedReflectiveProvider, NoProviderError } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { registry, EntityType, RegistryEntityStatic } from '../../common/registry/entityRegistry';

export abstract class EntityBootstrapper {

  protected resolvedEntityProviders: ResolvedReflectiveProvider[];
  protected injector: ReflectiveInjector;
  protected logger: Logger;

  public abstract getResolvedProviders(): ResolvedReflectiveProvider[];

  public invokeBootstrap(): void | Promise<void> {
    this.logger = this.injector.get(Logger)
      .source(this.constructor.name);
    return this.bootstrap();
  }

  public setInjector(injector: ReflectiveInjector):this {
    this.injector = injector;
    return this;
  }

  protected getInstance<T extends Object>(resolvedInstanceProvider: ResolvedReflectiveProvider): T {
    let instance: T;
    try {
      instance = this.injector.get(resolvedInstanceProvider.key.token);
    } catch (e) {
      if (!(e instanceof NoProviderError)) {
        console.log('ERROR!', resolvedInstanceProvider.key.displayName, e);
        throw e;
      }
      instance = this.injector.instantiateResolved(resolvedInstanceProvider);
    }

    let logMessage = `Resolved ${instance.constructor.name}`;

    if (instance.constructor.name !== resolvedInstanceProvider.key.displayName) {
      logMessage += ` as ${resolvedInstanceProvider.key.displayName}`;
    }

    this.logger.info(logMessage);

    return instance;
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
