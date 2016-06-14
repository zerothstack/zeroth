import { RelationHydrator, ModelStatic, Model } from '../models/model';
import { initializeRelationMap } from './index';

/**
 * By default just create a new model from the static instance
 * @param modelStatic
 * @returns {function(Object, Model): Model}
 */
function defaultHydratorFactory(modelStatic: ModelStatic<any>): RelationHydrator {

  return (data: Object, reference: Model): Model => new modelStatic(data);
}

/**
 * Decorator for HasOne relationships
 * @param modelStatic
 * @param relationHydrator
 * @returns {function(any, string): undefined}
 */
export function hasOne(modelStatic?: ModelStatic<any>, relationHydrator?: RelationHydrator): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    initializeRelationMap(target);

    if (!modelStatic) {
      modelStatic = Reflect.getMetadata("design:type", target, propertyKey);
    }

    if (!relationHydrator) {
      relationHydrator = defaultHydratorFactory(modelStatic);
    }

    target.__relations.set(propertyKey, relationHydrator);
  };
}
