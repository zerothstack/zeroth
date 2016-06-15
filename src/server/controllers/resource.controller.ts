import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { AbstractController} from './abstract.controller';
import { Logger } from '../../common/services/logger.service';
import { Action } from './action.decorator';
import { Model } from '../../common/models/model';
import { Response } from './response';
import { Request } from './request';
import { Store } from '../../common/stores/store';
import { Collection } from '../../common/models/collection';

/**
 * Abstract controller that all controllers should extend from
 */
@Injectable()
export abstract class ResourceController<M extends Model> extends AbstractController {

  constructor(server: Server, logger: Logger, protected modelStore:Store<M>) {
    super(server, logger);
  }

  /**
   * Get one entity
   * @param request
   * @param response
   * @returns {any}
   */
  @Action('GET', '/{id}')
  public getOne(request: Request, response: Response): Promise<Response> {

    this.logger.debug('reading params', request);

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
  @Action('GET', '/')
  public getMany(request: Request, response: Response): Promise<Response> {

    return this.modelStore
      .findMany()
      .then((collection:Collection<M>) => response.data(collection));
  }

}
