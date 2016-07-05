/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { Injector } from '@angular/core';
import { useContainer, Validator } from 'class-validator';

interface InjectableClass<T> {
  new (...args: any[]): T
}
/**
 * class-validator has a basic inversion container that handles classes without constructor arguments
 * This hybric class re-implements that injector, and extends it to be able to use the core angular
 * injector when available.
 */
class HybridInjector {

  public injector: Injector;

  // private instances: any[] = [];
  private instances: WeakMap<InjectableClass<any>, any> = new WeakMap();

  /**
   * Get the instance of a class when there is no dependency
   * @param staticClass
   * @returns {any}
   */
  public noDependencyGet<T>(staticClass: InjectableClass<T>): T {

    if (!this.instances.has(staticClass)){
      this.instances.set(staticClass, new staticClass());
    }

    return this.instances.get(staticClass);
  }

  public get<T>(staticClass: InjectableClass<T>): T {
    try {
      if (!this.injector) {
        return this.noDependencyGet(staticClass);
      }

      return this.injector.get(staticClass);
    } catch (e) {
      return this.noDependencyGet(staticClass);
    }
  }
}

let hybridInjectorInstance: HybridInjector = new HybridInjector();
useContainer(hybridInjectorInstance);

/**
 * Get the (singleton) validator instance and assign the dependency injector so custom validators
 * can use the DI service.
 * @param injector
 * @returns {Validator}
 */
export function getValidator(injector: Injector): Validator {
  hybridInjectorInstance.injector = injector;

  return hybridInjectorInstance.get(Validator);
}

// This common export is used so that both the core and the implementing modules
// use the same instance. This is necessary as class-validator does a single export
// of the MetadataStorage class which is used as a singleton. Otherwise, the models
// may register their validations against a different store than what is validated with
export * from 'class-validator';
