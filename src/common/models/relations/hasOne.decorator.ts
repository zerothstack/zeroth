/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic } from '../model';
import { initializeRelationMap } from './index';
import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';
/**
 * Decorator for HasOne relationships
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
