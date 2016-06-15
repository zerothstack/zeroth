import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Store } from '../../common/stores/store';
import { identifier, ModelStatic, Model } from '../../common/models/model';
import { Logger } from '../../common/services/logger.service';
import { Collection } from '../../common/models/collection';

@Injectable()
export abstract class HttpStore<T extends Model> extends Store<T> {

  private endpoint: string = 'api/users';
  protected logger: Logger;

  constructor(modelStatic: ModelStatic<T>, protected http: Http, loggerBase: Logger) {
    super(modelStatic);
    this.logger = loggerBase.source('HTTP Store');
  }

  /**
   * Retrieve one model from the REST api
   * @param id
   * @returns {IPromise<void>|Promise<T>}
   */
  public findOne(id: identifier): Promise<T> {

    return this.http.get(`${this.endpoint}/${id}`)
      .toPromise()
      .then((res: Response) => this.extractModel(res))
      .catch((error) => this.handleError(error));

  }

  public findMany(query?:any):Promise<Collection<T>> {
    return this.http.get(`${this.endpoint}/`)
      .toPromise()
      .then((res: Response) => this.extractCollection(res))
      .catch((error) => this.handleError(error));
  }

  /**
   * Extract model from the payload
   * @param res
   * @returns {T}
   */
  private extractModel(res: Response): T {
    let body = res.json();
    return new this.modelStatic(body);
  }

  /**
   * Extract collection of models from the payload
   * @param res
   * @returns {Collection<T>}
   */
  private extractCollection(res: Response): Collection<T> {
    let body = res.json();
    return new Collection<T>(body.map((modelData:Object) => new this.modelStatic(modelData)));
  }

  /**
   * Handle any exceptions
   * @param error
   * @returns {Promise<void>|Promise<T>}
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this.logger.error(errMsg);
    return Promise.reject(errMsg);
  }

}
