import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Store } from '../../common/stores/store';
import { identifier, ModelStatic, Model } from '../../common/models/model';
import { Logger } from '../../common/services/logger.service';

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
      .then((res: Response) => this.extractData(res))
      .catch((error) => this.handleError(error));

  }

  /**
   * Extract from the payload
   * @param res
   * @returns {T}
   */
  private extractData(res: Response): T {
    let body = res.json();
    return new this.modelStatic(body);
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
