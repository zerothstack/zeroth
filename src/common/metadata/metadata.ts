import { TableOptions } from 'typeorm/decorator/options/TableOptions';
import { RelationType, Relation } from '../models/relations/index';
import { ModelConstructor } from '../models/model';
import { RegistryEntityConstructor } from '../registry/entityRegistry';

export interface ModelMetadata {
  storageKey?: string;
  tableOptions?: TableOptions; //@todo verify this import doesn't cause frontend import of typeorm
  relations?: Map<RelationType, Map<string, Relation>>;
  storedProperties?: Map<string, any>
  identifierKey?:string;
  timestamps?: {
    created?:string
    updated?:string
  }
}

export function initializeMetadata(target: RegistryEntityConstructor) {
  if (!target.__metadata) {
    target.__metadata = {};
  }
}
