/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic, ModelConstructor } from '../model';
import { initializeMetadata } from '../../metadata/metadata';

export type RelationType = 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';

export interface Relation {
  model: ModelStatic<any>;
  databaseOptions: any;
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
