import { ActionType } from './abstract.controller';

/**
 * Decorator for registering a basic action method in a controller
 * @param method
 * @param route
 * @returns {function(any, string, TypedPropertyDescriptor<T>): undefined}
 * @constructor
 */
export function Action<T>(method: ActionType, route: string): MethodDecorator {

  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    target.registerActionMethod(propertyKey, method, route);
  };
}
