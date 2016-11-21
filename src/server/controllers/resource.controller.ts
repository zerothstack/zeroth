/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { AbstractController } from './abstract.controller';
import { Logger } from '../../common/services/logger.service';
import { Route } from './route.decorator';
import { AbstractModel } from '../../common/models/model';
import { Response } from './response';
import { Request } from './request';
import { AbstractStore } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';
import { ValidatorOptions } from '../../common/validation';
import { NotFoundException } from '../../common/exceptions/exceptions';

/**
 * Provides resource controller that all controllers that interact RESTfully with ModelStores
 * should extend from.
 */
@Injectable()
export abstract class ResourceController<M extends AbstractModel> extends AbstractController {

  constructor(logger: Logger, protected modelStore: AbstractStore<M>) {
    super(logger);
  }

  /**
   * Get one entity
   * @param request
   * @param response
   * @returns {any}
   */
  @Route('GET', '/:id')
  public getOne(request: Request, response: Response): Promise<Response> {

    return this.modelStore
      .findOne(request.params()
        .get('id'))
      .then((model: M) => response.data(model));
  }

  /**
   * Get many entities
   * @param request
   * @param response
   * @returns {any}
   */
  @Route('GET', '/')
  public getMany(request: Request, response: Response): Promise<Response> {

    return this.modelStore
      .findMany()
      .then((collection: Collection<M>) => response.data(collection));
  }

  /**
   * Process and persist an entity
   * @param request
   * @param response
   */
  @Route('PUT', '/:id')
  public putOne(request: Request, response: Response): Promise<Response> {

    return this.savePayload(request, response);
  }

  /**
   * Process and update entity, skipping validation of any missing properties
   * @param request
   * @param response
   * @returns {Promise<Response>}
   */
  @Route('PATCH', '/:id')
  public patchOne(request: Request, response: Response): Promise<Response> {
    return this.savePayload(request, response, true, {
      skipMissingProperties: true,
    });
  }

  /**
   * Delete the payload model from the model store
   * @param request
   * @param response
   * @returns {Promise<Response>}
   */
  @Route('DELETE', '/:id')
  public deleteOne(request: Request, response: Response): Promise<Response> {

    return request.getPayload()
      .then((data: any) => this.modelStore.hydrate(data))
      .then((model: M) => this.modelStore.deleteOne(model))
      .then((model: M) => response.data(model));
  }

  /**
   * Persist the request payload with the model store with optional validator options
   * @param request
   * @param response
   * @param validatorOptions
   * @param checkExists
   * @returns {Promise<Response>}
   */
  protected savePayload(request: Request, response: Response, checkExists: boolean = false, validatorOptions: ValidatorOptions = {}): Promise<Response> {
    let modelPayload = request.getPayload()
      .then((data: any) => this.modelStore.hydrate(data));

    if (checkExists) {

      modelPayload = modelPayload.then((payload: M) => {
        return this.modelStore.hasOne(payload)
          .then((exists: boolean) => {
            if (!exists) {
              throw new NotFoundException(`Model with id [${payload.getIdentifier()}] does not exist`);
            }
            return payload;
          });
      })

    }

    return modelPayload
      .then((model: M) => this.modelStore.validate(model, validatorOptions))
      .then((model: M) => this.modelStore.saveOne(model))
      .then((model: M) => response.data(model));
  }

}
