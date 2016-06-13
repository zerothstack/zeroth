import { RelationHydrator, ModelStatic, BaseModel } from '../models/base.model';
import { BaseCollection } from '../models/base.collection';
import { initializeRelationMap } from './index';
function defaultHydratorFactory(modelStatic: ModelStatic<any>): RelationHydrator {

  return (data: Object[], reference?: BaseModel): BaseCollection<BaseModel> => {
    return new BaseCollection(data.map((item: Object): BaseModel => new modelStatic(item)));
  };

}

export function hasMany(modelStatic: ModelStatic<any>, relationHydrator: RelationHydrator = defaultHydratorFactory(modelStatic)): PropertyDecorator {
  return (target: any, propertyKey: string) => {

    initializeRelationMap(target);

    target.__relations.set(propertyKey, relationHydrator);
  };
}
