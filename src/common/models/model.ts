import { Collection } from './collection';

export interface EntityNest extends Map<string, BaseModel|Collection<BaseModel>> {

}

export type identifier = string | number | symbol;

/**
 * Helper class for differentiating string keys with uuid keys
 */
export class UUID extends String {
  constructor(value?: any) {
    super(value);
  }
}

export interface ModelStatic<T extends BaseModel> {
  new(data?: any, exists?: boolean): T;
  identifierKey: string;
  modelName: string;
  storedProperties: Map<string, string>;
}

export interface TypeCaster {
  (value: any, reference: BaseModel): any;
}

export interface RelationHydrator {
  (modelCollection: Object | Object[], reference: BaseModel): BaseModel|Collection<BaseModel>;
}

export abstract class BaseModel {
  protected nestedEntities: EntityNest;

  public static identifierKey: string;
  public static storedProperties: Map<string, string>;
  public static modelName: string;

  constructor(data?: any) {
    this.hydrate(data);
  }

  /**
   * Hydrates the model from given data
   * @param data
   * @returns {BaseModel}
   */
  protected hydrate(data: Object) {

    if (!data){
      return this;
    }

    Object.assign(this, data);
    return this;
  }

  public getIdentifier(): identifier {
    const self = <typeof BaseModel>this.constructor;
    return this[self.identifierKey];
  }

}


