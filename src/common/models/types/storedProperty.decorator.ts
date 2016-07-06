/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelConstructor } from '../model';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';
import { initializeMetadata } from '../../metadata/metadata';

/**
 *  @StoredProperty property decorator for assigning the field type of the decorated property
 * @returns {function(ModelConstructor<any>, string): void}
 * @constructor
 */
export function StoredProperty(options?: ColumnOptions): PropertyDecorator {

  return function storedProperty(target: ModelConstructor<any>, propertyKey: string): void {

    initializeMetadata(target.constructor);

    if (!target.constructor.__metadata.storedProperties) {
      target.constructor.__metadata.storedProperties = new Map();
    }

    let type = Reflect.getMetadata("design:type", target, propertyKey);
    target.constructor.__metadata.storedProperties.set(propertyKey, {type, columnOptions: options});

  };

}
