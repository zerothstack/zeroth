/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic, ModelConstructor, AbstractModel } from '../model';
import {
  initializeRelationMap, ForeignRelationModelGetter, Relation,
  ViaPropertyDefinition
} from './index';
import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';

/**
 * Defines the relationship between the current model and a foreign model via the decorated key
 *
 * Example:
 * ```typescript
 *
 *  @Model
 *  class Thumb extends AbstractModel {
 *
 *    @BelongsTo(f => HandModel, hand => hand.handId)
 *    public hand: HandModel;
 *
 *  }
 *
 * ```
 */
export function BelongsTo<M extends AbstractModel, F extends AbstractModel>(foreignTypeGetter: ForeignRelationModelGetter<M, F>, viaProperty:ViaPropertyDefinition<F>, joinOptions?: RelationOptions): PropertyDecorator {
  return (target: ModelConstructor<M>, propertyKey: string) => {
    initializeRelationMap(target, 'belongsTo');

    target.constructor.__metadata.relations.get('belongsTo')
      .set(propertyKey, new Relation(target.constructor, foreignTypeGetter, viaProperty, joinOptions));
  };
}
