import {
  it, xit,
  inject,
  describe, xdescribe, fdescribe,
  beforeEachProviders,
  expect
} from '@angular/core/testing';
import { uuid, BaseModel, primary } from './base.model';
import { BaseCollection } from './base.collection';

class BasicModel extends BaseModel {

  @primary
  public id: number;
}

describe('Collection', () => {
  let collection: BaseCollection<BasicModel>;
  let data: BasicModel[];
  beforeEach(() => {

    data = [
      new BasicModel({id: 1}),
      new BasicModel({id: 2}),
    ];

    collection = new BaseCollection(data);
  });

  it('can iterate over the collection with forEach', () => {
    collection.forEach((item, index) => {
      expect(item)
        .toEqual(data[index]);
    });
  });

  it('can iterate with for...of', () => {

    let count = 0;
    for (let item of collection) {
      count++;
      expect(item instanceof BasicModel)
        .toBe(true);
    }

    expect(count)
      .toEqual(collection.length);

  });

  it('can find an item', () => {

    expect(collection.findById(2))
      .toEqual(collection[1]);

  });

  it('throws error when item can\'t be found', () => {
    let errorFind = () => collection.findById(3);
    expect(errorFind)
      .toThrowError(`Item with id [3] not in collection`);
  });

});
