/**
 * @module server
 */
/**
 * Decorator for controller classes to define their route base for namespacing
 * @param base
 * @returns {function(Function): void}
 * @constructor
 */
export function RouteBase(base: string): ClassDecorator {

  return function (target: Function): void {

    (<any>target).prototype.routeBase = base;
  };
}
