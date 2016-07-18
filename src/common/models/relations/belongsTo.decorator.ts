/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic } from '../model';
import { initializeRelationMap, ForeignRelationModelGetter, Relation } from './index';
import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';

/**
 * Defines the relationship between the current model and a foreign model vial the decorated key
 *
 * Example:
 * ```typescript
 *
 *  @Model
 *  class Thumb extends AbstractModel {
 *
 *    @BelongsTo(f => HandModel)
 *    public hand: HandModel;
 *
 *    public handId: number;
 *  }
 *
 * ```
 * Foreign model property is only required if there is no type annotation
 */
export function BelongsTo(foreignTypeGetter: ForeignRelationModelGetter, joinOptions?: RelationOptions): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    initializeRelationMap(target, 'belongsTo');

    target.constructor.__metadata.relations.get('belongsTo')
      .set(propertyKey, new Relation(target.constructor, foreignTypeGetter, joinOptions));
  };
}
