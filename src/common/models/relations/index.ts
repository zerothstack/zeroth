/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { ModelStatic, ModelConstructor, AbstractModel } from '../model';
import { initializeMetadata } from '../../metadata/metadata';

export type RelationType = 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';

/**
 * This is a crude method to two-way register the type of binding for relations. This is to overcome
 * a limitation of Typescripts design-time decorators and node's module resolution.
 * @see https://github.com/Microsoft/TypeScript/issues/4521
 */
export type ForeignRelationModelGetter<T extends AbstractModel, F extends AbstractModel> = (thisStatic?: ModelStatic<T>|any) => ModelStatic<F>;

export type ViaPropertyDefinition<T> = (foreign: T) => any;

export class Relation<M extends AbstractModel, F extends AbstractModel> {

  constructor(public model: ModelStatic<M>,
              private foreignRelationModelGetter: ForeignRelationModelGetter<M, F>,
              public viaProperty: ViaPropertyDefinition<F>,
              public databaseOptions?: any) {

  }

  public get foreign() {
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

  if (!target.constructor.__metadata.relations.has(type)) {
    target.constructor.__metadata.relations.set(type, new Map());
  }

}

export * from './hasOne.decorator';
export * from './belongsTo.decorator';
