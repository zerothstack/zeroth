import { RelationHydrator, ModelStatic, BaseModel } from '../models/base.model';
import { initializeRelationMap } from './index';
function defaultHydratorFactory(modelStatic: ModelStatic<any>): RelationHydrator {

  return (data: Object, reference: BaseModel): BaseModel => new modelStatic(data);
}

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
