/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelConstructor } from '../model';
import { initializeMetadata } from '../../metadata/metadata';

function initTimestamps(target: ModelConstructor<any>) {
  initializeMetadata(target);

  if (!target.constructor.__metadata.timestamps) {
    target.constructor.__metadata.timestamps = {};
  }
}

export function CreatedDate(): PropertyDecorator {

  return function createdDate(target: ModelConstructor<any>, propertyKey: string): void {
    initTimestamps(target);

    target.constructor.__metadata.timestamps.created = propertyKey;
  };

}

export function UpdatedDate(): PropertyDecorator {

  return function updatedDate(target: ModelConstructor<any>, propertyKey: string): void {

    initTimestamps(target);

    target.constructor.__metadata.timestamps.updated = propertyKey;
  };

}
