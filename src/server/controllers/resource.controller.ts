import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { AbstractController, Request, RouteParamMap } from './abstract.controller';
import { Logger } from '../../common/services/logger.service';
import { Action } from './action.decorator';
import { Model } from '../../common/models/model';

/**
 * Abstract controller that all controllers should extend from
 */
@Injectable()
export abstract class ResourceController extends AbstractController {

  constructor(server: Server, logger: Logger) {
    super(server, logger);
  }

  /**
   * Get one entity
   * @param request
   * @param routeParams
   * @returns {Model|Promise<Model>}
   */
  @Action('GET', '/{id}')
  public getOne(request: Request, routeParams: RouteParamMap) {

    return this.getOneById(request, routeParams);
  }

  /**
   * @todo provide default concrete implementation with the ResourceController
   * Supporter method for the `getOne` action. Must be implemented by the child controller
   * @param request
   * @param routeParams
   */
  protected abstract getOneById(request: Request, routeParams: RouteParamMap): Model | Promise<Model>;

}
