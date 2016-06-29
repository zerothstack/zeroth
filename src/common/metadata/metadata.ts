// import { TableOptions } from 'typeorm/decorator/options/TableOptions';
import { RelationType, Relation } from '../models/relations/index';
import { ModelConstructor } from '../models/model';
import { RegistryEntity } from '../registry/entityRegistry';
export type TableOptions = any;

export interface ModelMetadata {
  storageKey?: string;
  tableOptions?: TableOptions; //@todo verify this import doesn't cause frontend import of typeorm
  relations?: Map<RelationType, Map<string, Relation>>;
  storedProperties?: Map<string, any>
  identifierKey?:string;
}

export interface RegistryEntityConstructor extends Function {
  constructor: RegistryEntity;
}

export function initializeMetadata(target: RegistryEntityConstructor) {
  if (!target.constructor.__metadata) {
    target.constructor.__metadata = {};
  }
}
