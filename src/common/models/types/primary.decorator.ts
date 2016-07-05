/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';
import { ModelConstructor } from '../model';
import { StoredProperty } from './storedProperty.decorator';

export function Primary(options?: ColumnOptions): PropertyDecorator {

  return function primary(target: ModelConstructor<any>, propertyKey: string) {

    //associate with store properties so it doesn't need to be called twice
    StoredProperty(options)(target, propertyKey);

    target.constructor.__metadata.identifierKey = propertyKey;

  };

}
