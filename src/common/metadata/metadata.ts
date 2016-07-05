/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { TableOptions } from 'typeorm/decorator/options/TableOptions';
import { RelationType, Relation } from '../models/relations/index';
import { RegistryEntityConstructor } from '../registry/entityRegistry';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

export interface PropertyDefinition {
  type: any;
  columnOptions?: ColumnOptions;
}

export interface ModelMetadata {
  storageKey?: string;
  tableOptions?: TableOptions; //@todo verify this import doesn't cause frontend import of typeorm
  relations?: Map<RelationType, Map<string, Relation>>;
  storedProperties?: Map<string, PropertyDefinition>
  identifierKey?: string;
  timestamps?: {
    created?: string
    updated?: string
  }
}

export function initializeMetadata(target: RegistryEntityConstructor) {
  if (!target.constructor.__metadata) {
    target.constructor.__metadata = {};
  }
}
