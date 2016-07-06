/**
 * @module server
 */
/** End Typedoc Module Declaration */
import {
  AbstractController, MiddlewareRegistry,
  ControllerConstructor, ControllerStatic
} from '../controllers/abstract.controller';
import { MiddlewareFactory } from './index';
import { initializeMetadata, ControllerMetadata } from '../../common/metadata/metadata';
import {
  RegistryEntityStatic,
  RegistryEntityConstructor
} from '../../common/registry/entityRegistry';

/**
 * Decorator for assigning before middleware method in a controller
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 * @param middlewareFactories
 */
export function Before<T>(...middlewareFactories: MiddlewareFactory[]): MethodDecorator {

  return function (target: ControllerConstructor<any>, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    target.constructor.registerMiddleware('before', middlewareFactories, propertyKey);
  };
}

/**
 * Decorator for assigning after middleware method in a controller
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 * @param middlewareFactories
 */
export function After<T>(...middlewareFactories: MiddlewareFactory[]): MethodDecorator {

  return function (target: ControllerConstructor<any>, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    target.constructor.registerMiddleware('after', middlewareFactories, propertyKey);
  };
}

/**
 * Initializes the `registeredMiddleware` property on the controller with empty stores
 * @param target
 */
export function initializeMiddlewareRegister(target: RegistryEntityStatic<ControllerMetadata>): void {
  initializeMetadata(target);
  if (!target.__metadata.middleware) {
    target.__metadata.middleware = {
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
  return function (target: ControllerStatic<any>): void {
    target.registerMiddleware('before', middlewareFactories);
  }
}

/**
 * Decorator for assigning after middleware to all methods in a controller
 * @param middlewareFactories
 * @returns {function(AbstractController): void}
 * @constructor
 */
export function AfterAll(...middlewareFactories: MiddlewareFactory[]): ClassDecorator {
  return function (target: ControllerStatic<any>): void {
    target.registerMiddleware('after', middlewareFactories);
  }
}
