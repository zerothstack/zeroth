import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { Request as HapiRequest, IReply, Response } from 'hapi';
import { Action } from './action.decorator';
import { BaseModel } from '../../common/models/base.model';
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

@Injectable()
export abstract class AbstractController {

  protected actionMethods: Map<string, MethodDefinition>;

  protected routeBase: string;
  protected logger: Logger;

  constructor(protected server: Server, logger: Logger) {
    this.logger = logger.source('controller');
    this.registerRoutes();
  }

  protected abstract getOneById(request: Request, routeParams: RouteParamMap): BaseModel | Promise<BaseModel>;

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

  @Action('GET', '/{id}')
  public getOne(request: Request, routeParams: RouteParamMap) {

    return this.getOneById(request, routeParams);
  }


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

}
