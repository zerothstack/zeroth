import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { AbstractController} from './abstract.controller';
import { Logger } from '../../common/services/logger.service';
import { Route } from './route.decorator';
import { BaseModel } from '../../common/models/model';
import { Response } from './response';
import { Request } from './request';
import { BaseStore } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';

/**
 * Abstract controller that all controllers should extend from
 */
@Injectable()
export abstract class ResourceController<M extends BaseModel> extends AbstractController {

  constructor(server: Server, logger: Logger, protected modelStore:BaseStore<M>) {
    super(server, logger);
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
      .findOne(request.params().get('id'))
      .then((model:M) => response.data(model));
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
      .then((collection:Collection<M>) => response.data(collection));
  }

  /**
   * Process and persist an entity
   * @param request
   * @param response
   */
  @Route('PUT', '/:id')
  public putOne(request: Request, response: Response): Promise<Response> {

    return request.getPayload()
      .then((data:any) => this.modelStore.hydrate(data))
      .then((model:M) => this.modelStore.validate(model))
      .then((model:M) => this.modelStore.saveOne(model))
      .then((model:M) => response.data(model));
  }

}
