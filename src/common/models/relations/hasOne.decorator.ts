/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic, AbstractModel, ModelConstructor } from '../model';
import { initializeRelationMap, ForeignRelationModelGetter, Relation } from './index';
import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';

/**
 * Defines the relationship between the current model and a foreign model via the decorated key
 *
 * Example:
 * ```typescript
 *
 *  @Model
 *  class Hand extends AbstractModel {
 *
 *    @HasOne(f => ThumbModel)
 *    public thumb: ThumbModel;
 *  }
 *
 * ```
 */
export function HasOne<M extends AbstractModel, F extends AbstractModel>(foreignTypeGetter: ForeignRelationModelGetter<M, F>, joinOptions?: RelationOptions): PropertyDecorator {
  return (target: ModelConstructor<M>, propertyKey: string) => {
    initializeRelationMap(target, 'hasOne');

    target.constructor.__metadata.relations.get('hasOne')
      .set(propertyKey, new Relation(target.constructor, foreignTypeGetter, null, joinOptions));
  };
}
