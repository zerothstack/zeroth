/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { AbstractController, MiddlewareRegistry } from '../controllers/abstract.controller';
import { MiddlewareFactory } from './index';

/**
 * Decorator for assigning before middleware method in a controller
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 * @param middlewareFactories
 */
export function Before<T>(...middlewareFactories: MiddlewareFactory[]): MethodDecorator {

  return function (target: AbstractController, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    target.registerMiddleware('before', middlewareFactories, propertyKey);
  };
}

/**
 * Decorator for assigning after middleware method in a controller
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 * @param middlewareFactories
 */
export function After<T>(...middlewareFactories: MiddlewareFactory[]): MethodDecorator {

  return function (target: AbstractController, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    target.registerMiddleware('after', middlewareFactories, propertyKey);
  };
}

/**
 * Initializes the `registeredMiddleware` property on the controller with empty stores
 * @param target
 */
export function initializeMiddlewareRegister(target: AbstractController): void {
  if (!target.registeredMiddleware) {
    target.registeredMiddleware = {
      methods: new Map<string, MiddlewareRegistry>(),
      all: {
        before: [],
        after: []
      }
    };
  }
}

/**
 * Decorator for assigning before middleware to all methods in a controller
 * @param middlewareFactories
 * @returns {function(AbstractController): void}
 * @constructor
 */
export function BeforeAll(...middlewareFactories: MiddlewareFactory[]): ClassDecorator {
  return function (target: Function): void {
    initializeMiddlewareRegister(target.prototype);
    target.prototype.registeredMiddleware.all.before = middlewareFactories;
  }
}

/**
 * Decorator for assigning after middleware to all methods in a controller
 * @param middlewareFactories
 * @returns {function(AbstractController): void}
 * @constructor
 */
export function AfterAll(...middlewareFactories: MiddlewareFactory[]): ClassDecorator {
  return function (target: Function): void {
    initializeMiddlewareRegister(target.prototype);
    target.prototype.registeredMiddleware.all.after = middlewareFactories;
  }
}
