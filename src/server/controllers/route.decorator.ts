/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { HttpMethod } from '../servers/abstract.server';
/**
 * Decorator for registering a basic action method in a controller
 * @param method
 * @param route
 * @returns {function(any, string, TypedPropertyDescriptor<T>): void}
 * @constructor
 */
export function Route<T>(method: HttpMethod, route: string): MethodDecorator {

  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void {

    target.registerActionMethod(propertyKey, method, route);
  };
}
