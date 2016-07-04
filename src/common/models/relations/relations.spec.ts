import { it, describe, expect, beforeEach } from '@angular/core/testing';
import Moment = moment.Moment;
import { HasOne } from './hasOne.decorator';
import { AbstractModel } from '../model';
import { Primary } from '../types/primary.decorator';

class ChildModel extends AbstractModel {

  @Primary()
  public id: string;//UUID;

  public name: string;

}

class BasicModel extends AbstractModel {

  @Primary()
  public id: string;//UUID;

  public name: string;

  @HasOne(ChildModel)
  child:ChildModel;

  @HasOne()
  child2:ChildModel;

}

describe('Model Relations', () => {

  it('registers hasOne relationship with the constructor', () => {

    const model = new BasicModel();

    const relations = model.getMetadata().relations;
    expect(relations).toBeDefined();
    expect(relations.get('hasOne').get('child').model).toEqual(ChildModel);

  });

  it('registers hasOne relationship correctly when the type is not passed', () => {

    const model = new BasicModel();

    const relations = model.getMetadata().relations;
    expect(relations.get('hasOne').get('child').model).toEqual(ChildModel);

  });

});
