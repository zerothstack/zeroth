import { BaseCollection } from './base.collection';

export interface EntityNest extends Map<string, AbstractModel|BaseCollection<AbstractModel>> {

}

export type identifier = string|number|symbol;
export type uuid = string;

export interface ModelStatic<T extends AbstractModel> {
  new(data?: any, exists?: boolean): T;
}

export abstract class AbstractModel {
  protected nestedEntities: EntityNest;

  protected identifierKey: string;

  constructor(data?: any) {
    this.hydrate(data);
  }

  protected hydrate(data:any) {
    Object.assign(this, data);
  }

  public getIdentifier(): identifier {
    return this[this.identifierKey];
  }

}

export function primary(target: any, propertyKey: string) {
  target.identifierKey = propertyKey;
}

export function maxLength(length:number){
  return (target: any, propertyKey: string) => {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
    console.log(length, type);
  }
}

export class ModelStore<T extends AbstractModel> {

  constructor(protected model: ModelStatic<T>) {

  }

  public findOne(id: identifier): T {
    return new this.model({
      userId: id,
      username: 'zak',
      birthday: new Date(1990, 10, 22)
    });
  }

}
