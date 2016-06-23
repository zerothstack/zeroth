import { RelationHydrator, ModelStatic, BaseModel } from '../models/model';
import { Collection } from '../models/collection';
import { initializeRelationMap } from './index';

/**
 * By default just hydrate every item in the array and return collection
 * @param modelStatic
 * @returns {function(Object[], Model=): Collection<Model>}
 */
function defaultHydratorFactory(modelStatic: ModelStatic<any>): RelationHydrator {
  return (data: Object[], reference?: BaseModel): Collection<BaseModel> => {
    return new Collection(data.map((item: Object): BaseModel => new modelStatic(item)));
  };
}

/**
 * Decorator for HasMany relationships
 * @param modelStatic
 * @param relationHydrator
 * @returns {function(any, string): undefined}
 */
export function hasMany(modelStatic: ModelStatic<any>, relationHydrator: RelationHydrator = defaultHydratorFactory(modelStatic)): PropertyDecorator {
  return (target: any, propertyKey: string) => {

    initializeRelationMap(target);

    target.__relations.set(propertyKey, relationHydrator);
  };
}
