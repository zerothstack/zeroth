/**
 * @module common
 */
/**
 * Common interface that all services *must* extend
 */
export abstract class AbstractService {

  /**
   * Method called at startup to defer bootstrapping of other components until resolved
   * @returns {Promise<AbstractService>}
   */
  public initialize():Promise<this> | this {
    return Promise.resolve(this);
  }

}
