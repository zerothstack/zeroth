import { ModelConstructor } from '../model';
import { initializeMetadata } from '../../metadata/metadata';
export function StoredProperty(): PropertyDecorator {

  return function storedProperty(target: ModelConstructor<any>, propertyKey: string): void {
    
    initializeMetadata(target);
    
    if (!target.constructor.__metadata.storedProperties) {
      target.constructor.__metadata.storedProperties = new Map();
    }

    let type = Reflect.getMetadata("design:type", target, propertyKey);
    target.constructor.__metadata.storedProperties.set(propertyKey, type);

  };

}
