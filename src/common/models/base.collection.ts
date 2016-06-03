import { AbstractModel, identifier } from './abstract.model';

export class BaseCollection<T extends AbstractModel> extends Array {

  public findById(id: identifier): AbstractModel {

    for (let model of this) {
      if (model.getIdentifier() === id) {
        return model;
      }
    }

    throw new Error(`Item with id [${id}] not in collection`);
  }

}
