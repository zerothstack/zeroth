import { ThumbModel } from './thumb.model.fixture';
import { HandModel } from './hand.model.fixture';

describe('Model Relations', () => {

  it('registers hasOne relationship with the constructor', () => {

    const model = new HandModel();

    const relations = model.getMetadata().relations;
    expect(relations)
      .toBeDefined();
    expect(relations.get('hasOne')
      .get('thumb').foreign)
      .toEqual(ThumbModel);

  });

  it('registers belongsTo relationship with metadata', () => {

    const model = new ThumbModel();

    const relations = model.getMetadata().relations;

    expect(relations.get('belongsTo')
      .get('hand').foreign)
      .toEqual(HandModel);

    expect(relations.get('belongsTo')
      .get('hand').viaProperty(new HandModel({handId:1})))
      .toEqual(1);

  });

});
