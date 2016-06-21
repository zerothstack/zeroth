import { it, inject, beforeEachProviders, expect, describe } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { MockStore } from './mock.store';
import { Model, identifier } from '../models/model';
import { Store } from './store';
import { primary } from '../types/primary.decorator';
import { MinLength } from '../validation';
import { ValidationException } from '../../server/exeptions/exceptions';

class Ship extends Model {
  @primary
  public shipId:number;

  @MinLength(2)
  public name:string;

  public idRandom:string;
  public idSeeded:string;
}

abstract class ShipStore extends Store<Ship> {

}


class ShipMockStore extends MockStore<Ship> {

  constructor() {
    super(Ship);
  }

  protected getMock(id?:identifier):Ship {
    return new this.modelStatic({
      shipId: id || this.chance().integer(),
      name: 'Razorback',
      idRandom: this.chance().guid(),
      idSeeded: this.chance(1).guid(),
    });
  }

}

@Injectable()
class TestClass {

  constructor(public shipStore:ShipStore){

  }

}

const providers = [
  TestClass,
  {provide: ShipStore, useClass: ShipMockStore},
];

describe('Mock Store', () => {

  beforeEachProviders(() => providers);

  it('is injected with the store instance token', inject([TestClass], (c: TestClass) => {

    expect(c instanceof TestClass).toBe(true);
    expect(c.shipStore instanceof Store).toBe(true);
    expect(c.shipStore instanceof ShipMockStore).toBe(true);

  }));

  it('retrieves a promise of a mock entity', inject([TestClass], (c: TestClass) => {

    return c.shipStore.findOne(1234).then((entity) => {
      console.log(entity);

      expect(entity instanceof Ship).toBe(true);
      expect(entity.getIdentifier()).toBe(1234);
    });

  }));

  it('mocks random and seeded random data', inject([TestClass], (c: TestClass) => {

    return c.shipStore.findMany(1234).then((ships:Ship[]) => {

      expect(ships[0].idRandom).not.toEqual(ships[1].idRandom);
      expect(ships[0].idSeeded).toEqual(ships[1].idSeeded);

    });

  }));

  it('mocks save action', inject([TestClass], (c: TestClass) => {

    let shipRef:Ship = null;

    return c.shipStore.findOne(1234)
      .then((ship:Ship) => {
        shipRef = ship;
        return c.shipStore.saveOne(ship)
      })
      .then((ship) => {
        expect(shipRef).toEqual(ship);
      });

  }));

  it('explicitly hydrates from raw data', inject([TestClass], (c: TestClass) => {

    let data:any = {
      shipId: 321,
      name: 'Rocinante'
    };

    return c.shipStore.hydrate(data)
      .then((ship:Ship) => {
        expect(ship instanceof Ship).toBe(true);
        expect(ship.getIdentifier()).toEqual(321);
        expect(ship.name).toEqual(data.name);
      })

  }));

  it('validates model data, returning instance on pass', inject([TestClass], (c: TestClass) => {
    let shipRef:Ship = null;

    return c.shipStore.findOne(1234)
      .then((ship:Ship) => {
        shipRef = ship;
        return c.shipStore.validate(ship);
      }).then((ship) => {
        expect(shipRef).toEqual(ship);
      });

  }));

  it('validates model data, returning ValidationException with data on failure', inject([TestClass], (c: TestClass) => {
    return c.shipStore.findOne(1234)
      .then((ship:Ship) => {
        ship.name = 'a'; //too short
        return c.shipStore.validate(ship);
      })
      .catch((e) => {
        expect(e instanceof ValidationException).toBe(true);
        expect(e.getData()[0].errorName).toEqual('min_length');
      });

  }));



});
