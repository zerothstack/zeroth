import { ActionType } from './abstract.controller';
export function Action(method: ActionType, route: string) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    target.registerActionMethod(propertyKey, method, route);
  };
}
