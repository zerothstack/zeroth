/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { TableOptions } from 'typeorm/decorator/options/TableOptions';
import { RelationType, Relation } from '../models/relations/index';
import { EntityMetadata, RegistryEntityStatic } from '../registry/entityRegistry';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

export interface PropertyDefinition {
  type: any;
  columnOptions?: ColumnOptions;
}

export interface ModelMetadata {
  storageKey?: string;
  tableOptions?: TableOptions;
  relations?: Map<RelationType, Map<string, Relation<any, any>>>;
  storedProperties?: Map<string, PropertyDefinition>
  identifierKey?: string;
  timestamps?: {
    created?: string
    updated?: string
  }
}

/**
 * Common function used by many methods to ensure the entity has __metadata initialized on it's constructor
 * @param target
 */
export function initializeMetadata(target: RegistryEntityStatic<EntityMetadata>) {
  if (!target.__metadata) {
    target.__metadata = {};
  }
}
