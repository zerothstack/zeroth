import { AbstractModel } from './abstract.model';

export class BaseCollection<T extends AbstractModel> extends Array {

  public findById(id: Symbol): AbstractModel {

    for (let model of this) {
      if (model.getIdentifier() === id) {
        return model;
      }
    }

    throw new Error(`Item with id [${id}] not in collection`);
  }

}
