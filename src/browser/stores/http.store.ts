/**
 * @module browser
 */
/** End Typedoc Module Declaration */
import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AbstractStore } from '../../common/stores/store';
import { identifier, ModelStatic, AbstractModel } from '../../common/models/model';
import { Logger } from '../../common/services/logger.service';
import { Collection } from '../../common/models/collection';
import 'rxjs/add/operator/toPromise';

@Injectable()
export abstract class HttpStore<T extends AbstractModel> extends AbstractStore<T> {

  protected logger: Logger;

  constructor(modelStatic: ModelStatic<T>, injector:Injector, protected http: Http, loggerBase: Logger) {
    super(modelStatic, injector);
    this.logger = loggerBase.source('HTTP Store');
  }


  protected endpoint(id?: identifier): string {

    let endpoint = `${process.env.API_BASE}/${this.modelStatic.getMetadata().storageKey}`;

    if (id) {
      endpoint += `/${id}`;
    }
    return endpoint;
  };

  /**
   * Retrieve one model from the REST api
   * @param id
   * @returns {IPromise<void>|Promise<T>}
   */
  public findOne(id: identifier): Promise<T> {

    return this.http.get(this.endpoint(id))
      .toPromise()
      .then((res: Response) => this.checkStatus(res))
      .then((res: Response) => this.extractModel(res))
      .catch((error) => this.handleError(error));

  }

  /**
   * Find many models
   * @param query
   * @returns {IPromise<void>|Promise<T>}
   */
  public findMany(query?:any):Promise<Collection<T>> {
    return this.http.get(this.endpoint())
      .toPromise()
      .then((res: Response) => this.checkStatus(res))
      .then((res: Response) => this.extractCollection(res))
      .catch((error) => this.handleError(error));
  }

  /**
   * Save a model
   * @param model
   * @returns {Promise<void>|IPromise<void>|Promise<T>}
   */
  public saveOne(model:T):Promise<T> {
    //@todo consider toJson method if custom serializing is needed?
    //@todo extract only changed properties
    //@todo switch on if existing and decide if put or patch request
    return this.http.put(this.endpoint(model.getIdentifier()), model)
      .toPromise()
      .then((res: Response) => this.checkStatus(res))
      .then(() => model) //@todo flag model as existing
      // .catch((error) => this.handleError(error));
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
    let message:any;

    if (error instanceof Response){
      message = error.json();
      if (message.message){
        message = message.message;
      }
    } else {
      message = error.message;
    }

    let errMsg = (message) ? message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    this.logger.error(errMsg);
    return Promise.reject(errMsg);
  }

  /**
   * Check the status is ok.
   * This only seems to be required for unit testing @todo resolve why there is a discrepancy
   * @param res
   * @returns {any}
   */
  private checkStatus(res: Response):Response|Promise<any> {
    if (res.ok){
      return res;
    }

    return Promise.reject(res);
  }
}
