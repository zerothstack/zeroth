import { ActionType } from './abstract.controller';
export function Action<T>(method: ActionType, route: string): MethodDecorator {

  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {

    target.registerActionMethod(propertyKey, method, route);
  };
}
