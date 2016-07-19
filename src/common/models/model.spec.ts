import { UUID, AbstractModel } from './model';
import { Primary } from './types/primary.decorator';
import Moment = moment.Moment;

class ChildModel extends AbstractModel {

  @Primary()
  public id: string;//UUID;

  public name: string;

}

class BasicModel extends AbstractModel {

  @Primary()
  public id: string;//UUID;

  public stringNoDefault: string;
  public stringWithDefault: string = 'foo';

}

describe('Model', () => {
  let instance: BasicModel;
  const id = 'f0d8368d-85e2-54fb-73c4-2d60374295e3';
  beforeEach(() => {

    instance = new BasicModel({id});
  });

  it('hydrates a basic model', () => {

    expect(instance.id)
      .toEqual(id);
  });

  it('retrieves the identifier with @Primary decorator', () => {
    expect(instance.getIdentifier())
      .toEqual(id);
  });

  it('retains default property values', () => {
    expect(instance.stringWithDefault)
      .toEqual('foo');
  });

  it('returns undefined for properties without default', () => {
    expect(instance.stringNoDefault)
      .toEqual(undefined);
  });

  it('creates a model without properties if none are passed', () => {
    const model = new BasicModel;
    expect(Object.assign({}, model)).toEqual({stringWithDefault:'foo'});
  });

});

describe('UUID', () => {

  it('extends String', () => {

    const id = new UUID('72eed629-c4ab-4520-a987-4ea26b134d8c');

    expect(id instanceof UUID).toBe(true);
    expect(id instanceof String).toBe(true);
  });

});
