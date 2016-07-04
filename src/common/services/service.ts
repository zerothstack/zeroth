export abstract class AbstractService {

  public initialize():Promise<this> | this {
    return Promise.resolve(this);
  }

}
