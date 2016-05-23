import { Server } from '../servers/abstract.server';
import { Injectable } from '@angular/core';
import { Request as HapiRequest, IReply, Response } from 'hapi';
import * as _ from 'lodash';
import { Cat } from '../../common/models/index';
import { Action } from './action.decorator';

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

  protected __actionMethods: Map<string, MethodDefinition>;

  protected routeBase: string;

  constructor(protected server: Server) {
    this.registerRoutes();
  }

  public registerActionMethod(methodSignature: string, method: ActionType, route: string) {
    if (!this.__actionMethods) {
      this.__actionMethods = new Map<string, MethodDefinition>();
    }

    const methodDefinition: MethodDefinition = {
      method,
      route
    };

    this.__actionMethods.set(methodSignature, methodDefinition);
  }

  @Action('GET', '/{id}')
  public getOne(request: Request, ...routeParams: RouteParam[]) {

    const greeting = new Cat().greet();

    return {id: routeParams[0], greeting};
  }

  public registerRoutes(): void {

    this.__actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      this.server.register({
        method: methodDefinition.method,
        path: `/${this.routeBase}${methodDefinition.route}`,
        handler: (request: Request, reply: IReply): Response => {

          let response = this[methodSignature](request, ...request.paramsArray);

          return reply(response);
        }
      });

    });

  }

}
