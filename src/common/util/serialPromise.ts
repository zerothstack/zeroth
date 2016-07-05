/**
 * @module common
 */
/** End Typedoc Module Declaration */
export interface PromiseFactory<T> {
  (arg?: any, ...args: any[]): T | Promise<T>;
}

/**
 * Invoke a series of promise factories one after the other, only kicking off the next promise
 * when the prior one resolves.
 * @param promiseFactories
 * @returns {Promise<any>}
 * @param thisArg
 * @param args
 * @param initialValue
 */
export function serialPromise<T>(promiseFactories: PromiseFactory<T>[], initialValue:T, thisArg: any = null, ...args: any[]): Promise<T> {
  return promiseFactories.reduce((soFar: Promise<T>, next: PromiseFactory<T>): Promise<T> => {

    return soFar.then((result): Promise<T> => {
      return Promise.resolve(next.call(thisArg, result, ...args));
    });

  }, Promise.resolve(initialValue));
}
