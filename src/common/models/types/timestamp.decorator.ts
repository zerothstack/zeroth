/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelConstructor } from '../model';
import { initializeMetadata } from '../../metadata/metadata';

/**
 * Initializes the timestamps metadata property with empty values
 * @param target
 */
function initTimestamps(target: ModelConstructor<any>) {
  initializeMetadata(target.constructor);

  if (!target.constructor.__metadata.timestamps) {
    target.constructor.__metadata.timestamps = {};
  }
}

/**
 *  @CreatedDate property decorator for assigning which property is to be defined as the created date
 * @returns {function(ModelConstructor<any>, string): void}
 * @constructor
 */
export function CreatedDate(): PropertyDecorator {

  return function createdDate(target: ModelConstructor<any>, propertyKey: string): void {
    initTimestamps(target);

    target.constructor.__metadata.timestamps.created = propertyKey;
  };

}

/**
 *  @UpdatedDate property decorator for assigning which property is to be defined as the updated date
 * @returns {function(ModelConstructor<any>, string): void}
 * @constructor
 */
export function UpdatedDate(): PropertyDecorator {

  return function updatedDate(target: ModelConstructor<any>, propertyKey: string): void {

    initTimestamps(target);

    target.constructor.__metadata.timestamps.updated = propertyKey;
  };

}
