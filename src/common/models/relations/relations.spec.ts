import Moment = moment.Moment;
import { ThumbModel } from './thumb.model.fixture';
import { HandModel } from './hand.model.fixture';

describe('Model Relations', () => {

  it('registers hasOne relationship with the constructor', () => {

    const model = new HandModel();

    const relations = model.getMetadata().relations;
    expect(relations)
      .toBeDefined();
    expect(relations.get('hasOne')
      .get('left').foreign)
      .toEqual(ThumbModel);

  });

  it('registers hasOne relationship correctly when the type is not passed', () => {

    const model = new HandModel();

    const relations = model.getMetadata().relations;
    expect(relations.get('hasOne')
      .get('right').foreign)
      .toEqual(ThumbModel);

  });

  it('registers belongsTo relationship with metadata', () => {

    const model = new ThumbModel();

    const relations = model.getMetadata().relations;

    expect(relations.get('belongsTo')
      .get('hand').foreign)
      .toEqual(HandModel);

  });

});
