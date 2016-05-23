export function RouteBase(base: string) {

  return function (target: Function) {

    (<any>target).prototype.routeBase = base;
  };
}
