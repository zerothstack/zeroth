import { Observable } from 'rxjs/Observable';
import { identifier, ModelStatic, BaseModel } from '../models/base.model';
export abstract class ModelStore<T extends BaseModel> {

  constructor(protected model: ModelStatic<T>) {

  }

  public abstract findOne(id: identifier): Promise<T>;

}
