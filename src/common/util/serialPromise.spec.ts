import {
  it,
  describe,
  expect
} from '@angular/core/testing';
import { serialPromise } from './serialPromise';

describe('Process promises sequentially', () => {

  it('should be able to run a series of promises in sequence', () => {

    let promiseFactories = [
      (value: number) => Promise.resolve(value + 1),
      (value: number) => Promise.resolve(value + 2),
      (value: number) => Promise.resolve(value + 3),
    ];

    let promiseResult = serialPromise(promiseFactories, 0);

    promiseResult.then((result) => {
      expect(result)
        .toEqual(6);
    });

  });

  it('should be able to run a series of promises in sequence with extra arguments', () => {

    let promiseFactories = [
      (value: number, extra: number) => Promise.resolve(value + 1 + extra),
      (value: number, extra: number) => Promise.resolve(value + 2 + extra),
      (value: number, extra: number) => Promise.resolve(value + 3 + extra),
    ];

    let promiseResult = serialPromise(promiseFactories, 0, null, 2);

    return promiseResult.then((result) => {
      expect(result)
        .toEqual(12);
    });
  });

});
