export function RouteBase(base: string) {

  console.log('decorating!');

  return function (target: Function) {

    (<any>target).prototype.routeBase = base;

    // Reflect.defineMetadata('RouteBase', base, target);

  };
}
