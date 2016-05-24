import { AbstractModel } from '../../../common/models/abstract.model';
export class Cat extends AbstractModel {

  public greet(): string {
    return 'meow';
  }

}
