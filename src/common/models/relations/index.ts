/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic, ModelConstructor } from '../model';
import { initializeMetadata } from '../../metadata/metadata';

export type RelationType = 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';


/**
 * This is a crude method to two-way register the type of binding for relations. This is to overcome
 * a limitation of Typescripts design-time decorators and node's module resolution.
 * @see https://github.com/Microsoft/TypeScript/issues/4521
 */
export type ForeignRelationModelGetter = (thisStatic?:ModelStatic<any>) => ModelStatic<any>;

export class Relation {

  constructor(public model:ModelStatic<any>, private foreignRelationModelGetter:ForeignRelationModelGetter, public databaseOptions?:any) {

  }

  public get foreign(){
    return this.foreignRelationModelGetter(this.model);
  }

}

/**
 * Initializes relation metadata property with empty values. Common function used by all relation
 * decorators to verify there is somewhere to assign their metadata.
 * @param target
 * @param type
 */
export function initializeRelationMap(target: ModelConstructor<any>, type: RelationType) {
  initializeMetadata(target.constructor);

  if (!target.constructor.__metadata.relations) {
    target.constructor.__metadata.relations = new Map();
  }

  if (!target.constructor.__metadata.relations.has(type)){
    target.constructor.__metadata.relations.set(type, new Map());
  }

}

export * from './hasOne.decorator';
export * from './belongsTo.decorator';
