import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { Request as HapiRequest, IReply, Response } from 'hapi';
import { Action } from './action.decorator';
import { Model } from '../../common/models/model';
import { Logger } from '../../common/services/logger.service';

export interface Request extends HapiRequest {

}

export interface RouteParamMap extends Map<string,string> {}

export type ActionType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MethodDefinition {
  method: ActionType;
  route: string;
}

export interface MethodDictionary {
  [methodSignature: string]: MethodDefinition;
}

/**
 * Abstract controller that all controllers should extend from
 */
@Injectable()
export abstract class AbstractController {

  protected actionMethods: Map<string, MethodDefinition>;

  protected routeBase: string;
  protected logger: Logger;

  constructor(protected server: Server, logger: Logger) {
    this.logger = logger.source('controller');
    this.registerRoutes();
  }

  /**
   * Register an action. This is used by the @Action() decoratore, but can also be used directly
   * for custom route registration
   * @param methodSignature
   * @param method
   * @param route
   */
  public registerActionMethod(methodSignature: string, method: ActionType, route: string) {
    if (!this.actionMethods) {
      this.actionMethods = new Map<string, MethodDefinition>();
    }

    const methodDefinition: MethodDefinition = {
      method,
      route
    };

    this.actionMethods.set(methodSignature, methodDefinition);
  }

  /**
   * Register all routes defined in this controller (or any extending instances)
   * @returns {AbstractController}
   */
  public registerRoutes(): this {

    this.actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      this.server.register({
        method: methodDefinition.method,
        path: `/api/${this.routeBase}${methodDefinition.route}`,
        handler: (request: Request, reply: IReply): Response => {

          //polyfill for `const paramMap = new Map(Object.entries(request.params)`
          const paramMap:RouteParamMap = ((object:Object) => {
            let map = new Map();
            for (let key in object){
              map.set(key, object[key]);
            }
            return map;
          })(request.params);

          let response = this[methodSignature](request, paramMap);

          return reply(response);
        }
      });

      this.logger.debug(`registered ${methodDefinition.method} ${this.routeBase}${methodDefinition.route} to ${this.constructor.name}@${methodSignature}`);
    });

    return this;
  }

  // Common Routes

  /**
   * @todo move into an `abstract ResourceController extends AbstractController` to reduce clutter
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
