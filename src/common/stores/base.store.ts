import { identifier, ModelStatic, BaseModel } from '../models/base.model';
export class ModelStore<T extends BaseModel> {

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
