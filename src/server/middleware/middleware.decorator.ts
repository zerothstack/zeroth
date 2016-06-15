import { AbstractController } from '../controllers/abstract.controller';
import { InjectableMiddlewareFactory } from './index';

/**
 * Decorator for assigning middleware method in a controller
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 * @param middlewareFactories
 */
export function Before<T>(...middlewareFactories:InjectableMiddlewareFactory[]): MethodDecorator {

  return function (target: AbstractController, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

      target.registerMiddleware(propertyKey, 'before', middlewareFactories);
  };
}

/**
 * Decorator for assigning middleware method in a controller
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 * @param middlewareFactories
 */
export function After<T>(...middlewareFactories:InjectableMiddlewareFactory[]): MethodDecorator {

  return function (target: AbstractController, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

      target.registerMiddleware(propertyKey, 'after', middlewareFactories);
  };
}
