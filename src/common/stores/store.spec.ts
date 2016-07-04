import { inject, addProviders, async } from '@angular/core/testing';
import { Injectable, Injector } from '@angular/core';
import { MockStore } from './mock.store';
import { AbstractModel, identifier } from '../models/model';
import { AbstractStore } from './store';
import {
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '../validation';
import { ValidationException } from '../../server/exeptions/exceptions';
import { Primary } from '../models/types/primary.decorator';
import Spy = jasmine.Spy;

@Injectable()
class StubService {

  public isTruthy(value: any): boolean {
    return !!value;
  }

  public isTruthyPromise(value: any): Promise<boolean> {
    return Promise.resolve(!!value);
  }

}

@Injectable()
@ValidatorConstraint()
class CustomValidator implements ValidatorConstraintInterface {

  constructor(protected service: StubService) {
  }

  public validate(value: any): boolean {

    return this.service.isTruthy(value);
  }

}

@Injectable()
@ValidatorConstraint()
class CustomValidatorAsync implements ValidatorConstraintInterface {

  constructor(protected service: StubService) {
  }

  public validate(value: any): Promise<boolean> {

    return this.service.isTruthyPromise(value);
  }

}

class Ship extends AbstractModel {
  @Primary()
  public shipId: number;

  @MinLength(2)
  public name: string;

  public idRandom: string;
  public idSeeded: string;

  @Validate(CustomValidator)
  public truthyValue: any;

  @Validate(CustomValidatorAsync)
  public truthyValueAsync: any;

}

abstract class ShipStore extends AbstractStore<Ship> {

}

@Injectable()
class ShipMockStore extends MockStore<Ship> {

  constructor(injector: Injector) {
    super(Ship, injector);
  }

  protected getMock(id?: identifier): Ship {
    return new this.modelStatic({
      shipId: id || this.chance()
        .integer(),
      name: 'Razorback',
      idRandom: this.chance()
        .guid(),
      idSeeded: this.chance(1)
        .guid(),
      truthyValue: true,
      truthyValueAsync: true,
    });
  }

}

@Injectable()
class TestClass {

  constructor(public shipStore: ShipStore) {

  }

}

//we need to have a singleton instance here to spy on, as the validator creates new singletons
// of the custom validator
const stubServiceSingleton = new StubService();

const providers: any[] = [
  TestClass,
  CustomValidator,
  CustomValidatorAsync,
  {provide: StubService, deps: [], useFactory: () => stubServiceSingleton},
  {provide: ShipStore, useClass: ShipMockStore},
];

describe('Mock Store', () => {

  beforeEach(() => {
    addProviders(providers);
  });

  it('is injected with the store instance token', inject([TestClass], (c: TestClass) => {

    expect(c instanceof TestClass)
      .toBe(true);
    expect(c.shipStore instanceof AbstractStore)
      .toBe(true);
    expect(c.shipStore instanceof ShipMockStore)
      .toBe(true);

  }));

  it('is provides a dummy initialized method', inject([TestClass], (c: TestClass) => {

    c.shipStore.initialized()
      .then((instance) => {
        expect(instance)
          .toEqual(c.shipStore);
      });

  }));

  it('retrieves a promise of a mock entity', async(inject([TestClass], (c: TestClass) => {

    return c.shipStore.findOne(1234)
      .then((entity) => {

        expect(entity instanceof Ship)
          .toBe(true);
        expect(entity.getIdentifier())
          .toBe(1234);
      });

  })));

  it('mocks random and seeded random data', async(inject([TestClass], (c: TestClass) => {

    return c.shipStore.findMany(1234)
      .then((ships: Ship[]) => {

        expect(ships[0].idRandom)
          .not
          .toEqual(ships[1].idRandom);
        expect(ships[0].idSeeded)
          .toEqual(ships[1].idSeeded);

      });

  })));

  it('mocks save action', async(inject([TestClass], (c: TestClass) => {

    let shipRef: Ship = null;

    return c.shipStore.findOne(1234)
      .then((ship: Ship) => {
        shipRef = ship;
        return c.shipStore.saveOne(ship)
      })
      .then((ship) => {
        expect(shipRef)
          .toEqual(ship);
      });

  })));

  it('explicitly hydrates from raw data', async(inject([TestClass], (c: TestClass) => {

    let data: any = {
      shipId: 321,
      name: 'Rocinante'
    };

    return c.shipStore.hydrate(data)
      .then((ship: Ship) => {
        expect(ship instanceof Ship)
          .toBe(true);
        expect(ship.getIdentifier())
          .toEqual(321);
        expect(ship.name)
          .toEqual(data.name);
      })

  })));

  it('validates model data, returning instance on pass', async(inject([TestClass], (c: TestClass) => {
    let shipRef: Ship = null;

    return c.shipStore.findOne(1234)
      .then((ship: Ship) => {
        shipRef = ship;
        return c.shipStore.validate(ship);
      })
      .then((ship) => {
        expect(shipRef)
          .toEqual(ship);
      });

  })));

  it('validates model data, returning ValidationException with data on failure', async(inject([TestClass], (c: TestClass) => {
    return c.shipStore.findOne(1234)
      .then((ship: Ship) => {
        ship.name = 'a'; //too short
        return c.shipStore.validate(ship);
      })
      .catch((e) => {
        expect(e instanceof ValidationException)
          .toBe(true);

        expect(e.getData()[0].type)
          .toEqual('min_length');
      });

  })));

  it('validates model data, with custom validation with injected service dependency', async(inject([TestClass, StubService], (c: TestClass, s: StubService) => {

    let customValidatorServiceSpy = spyOn(stubServiceSingleton, 'isTruthy')
      .and
      .callThrough();

    return c.shipStore.findOne(1234)
      .then((ship: Ship) => {

        ship.truthyValue = 'truthy';

        return c.shipStore.validate(ship);
      })
      .then((ship) => {

        expect(customValidatorServiceSpy)
          .toHaveBeenCalledWith('truthy');

      });

  })));

  it('validates model data, with custom async validator', async(inject([TestClass, StubService], (c: TestClass, s: StubService) => {

    let customValidatorServiceSpy = spyOn(stubServiceSingleton, 'isTruthyPromise')
      .and
      .callThrough();

    return c.shipStore.findOne(1234)
      .then((ship: Ship) => {

        ship.truthyValueAsync = false;

        return c.shipStore.validate(ship);
      })
      .catch((e) => {

        expect(customValidatorServiceSpy)
          .toHaveBeenCalledWith(false);

        expect(e instanceof ValidationException)
          .toBe(true);

        expect(e.getData()[0].type)
          .toEqual('CustomValidatorAsync');
      });

  })));

});
