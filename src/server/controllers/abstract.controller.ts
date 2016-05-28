import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { Request as HapiRequest, IReply, Response } from 'hapi';
import { Action } from './action.decorator';
import { Logger } from '../services/logger.service';
import { AbstractModel } from '../../common/models/abstract.model';

export interface Request extends HapiRequest {

}

export interface RouteParam {
  key: string;
  value: string;
}

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
  protected logger: Logger

  constructor(protected server: Server, logger: Logger) {
    this.logger = logger.source('controller');
    this.registerRoutes();
  }

  protected abstract getOneById(request: Request, routeParams: RouteParam[]): AbstractModel;

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
  public getOne(request: Request, ...routeParams: RouteParam[]) {

    return this.getOneById(request, routeParams);
  }

  public registerRoutes(): this {

    this.actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      this.server.register({
        method: methodDefinition.method,
        path: `/${this.routeBase}${methodDefinition.route}`,
        handler: (request: Request, reply: IReply): Response => {

          let response = this[methodSignature](request, ...request.paramsArray);

          return reply(response);
        }
      });

      this.logger.debug(`registered ${methodDefinition.method} ${this.routeBase}${methodDefinition.route} to ${this.constructor.name}@${methodSignature}`);
    });

    return this;
  }

}
