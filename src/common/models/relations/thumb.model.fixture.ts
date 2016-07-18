import Moment = moment.Moment;
import { AbstractModel } from '../model';
import { Primary } from '../types/primary.decorator';
import { BelongsTo } from './belongsTo.decorator';
import { HandModel } from './hand.model.fixture';

export class ThumbModel extends AbstractModel {

  @Primary()
  public thumbId: string;//UUID;

  public name: string;

  @BelongsTo(f => HandModel)
  public hand: HandModel;

  public handId: string;

}
