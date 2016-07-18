import { AbstractModel } from './model';
import { Collection } from './collection';
import { Primary } from './types/primary.decorator';

class BasicModel extends AbstractModel {

  @Primary()
  public id: number;
}

describe('Collection', () => {
  let collection: Collection<BasicModel>;
  let data: BasicModel[];
  beforeEach(() => {

    data = [
      new BasicModel({id: 1}),
      new BasicModel({id: 2}),
    ];

    collection = new Collection(data);
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

  it('can check if an entity is present in the collection', () => {

    expect(collection.contains(data[1]))
      .toBe(true);
    expect(collection.contains(new BasicModel({id: 10})))
      .toBe(false);

  });

});
