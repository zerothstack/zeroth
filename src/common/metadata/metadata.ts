/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { TableOptions } from 'typeorm/decorator/options/TableOptions';
import { RelationType, Relation } from '../models/relations/index';
import { RegistryEntityConstructor } from '../registry/entityRegistry';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';
import { MiddlewareRegistry } from '../../server/controllers/abstract.controller';

export interface PropertyDefinition {
  type: any;
  columnOptions?: ColumnOptions;
}

export interface ModelMetadata {
  storageKey?: string;
  tableOptions?: TableOptions;
  relations?: Map<RelationType, Map<string, Relation>>;
  storedProperties?: Map<string, PropertyDefinition>
  identifierKey?: string;
  timestamps?: {
    created?: string
    updated?: string
  }
}

export interface ControllerMetadata {
  routeBase?:string;
  middleware?: {
    methods: Map<string, MiddlewareRegistry>
    all: MiddlewareRegistry
  }
}

/**
 * Common function used by many methods to ensure the entity has __metadata initialized on it's constructor
 * @param target
 */
export function initializeMetadata(target: RegistryEntityConstructor<any>) {
  if (!target.constructor.__metadata) {
    target.constructor.__metadata = {};
  }
}
