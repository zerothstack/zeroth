/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic } from '../model';
import { initializeRelationMap } from './index';
import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';

/**
 * Defines the relationship between the current model and a foreign model vial the decorated key
 *
 * Example:
 * ```typescript
 *
 *  @Model
 *  class Hand extends AbstractModel {
 *
 *    @HasOne()
 *    public thumb: ThumbModel;
 *  }
 *
 * ```
 * Foreign model property is only required if there is no type annotation
 */
export function HasOne(foreignModel?: ModelStatic<any>, joinOptions?:RelationOptions): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    initializeRelationMap(target, 'hasOne');

    if (!foreignModel) {
      foreignModel = Reflect.getMetadata("design:type", target, propertyKey);
    }

    target.constructor.__metadata.relations.get('hasOne').set(propertyKey, {
      model: foreignModel,
      joinOptions
    });
  };
}
