import { Server } from '../servers/abstract.server';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { Request as HapiRequest, IReply, Response as HapiResponse } from 'hapi';
import { Logger } from '../../common/services/logger.service';
import { InjectableMiddlewareFactory, MiddlewareFactory } from '../middleware/index';
import { PromiseFactory } from '../../common/util/serialPromise';

export interface Request extends HapiRequest {

}
export interface Response extends HapiResponse {

}

export interface RouteParamMap extends Map<string,string> {
}

export type ActionType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MethodDefinition {
  method: ActionType;
  route: string;
}

export interface MiddlewareRegistry {
  before: InjectableMiddlewareFactory[];
  after: InjectableMiddlewareFactory[];
}

export interface MethodDictionary {
  [methodSignature: string]: MethodDefinition;
}

export type MiddlewareLocation = 'before' | 'after';

/**
 * Abstract controller that all controllers should extend from
 */
@Injectable()
export abstract class AbstractController {

  protected actionMethods: Map<string, MethodDefinition>;
  protected registeredMiddleware: Map<string, MiddlewareRegistry>;

  protected routeBase: string;
  protected logger: Logger;
  private injector: ReflectiveInjector;

  constructor(protected server: Server, logger: Logger) {
    this.logger = logger.source('controller');
    this.registerRoutes();
  }

  /**
   * Register a reference to the current injector, this is not injected directly as there is likely
   * to be a better way to get an injector reference for decorators
   * @see https://github.com/angular/angular/issues/4112#issuecomment-175200243
   * @param injector
   * @returns {AbstractController}
   */
  public registerInjector(injector: ReflectiveInjector) {
    this.injector = injector;
    return this;
  }

  /**
   * Register an action. This is used by the @Action() decoratore, but can also be used directly
   * for custom route registration
   * @param methodSignature
   * @param method
   * @param route
   */
  public registerActionMethod(methodSignature: string, method: ActionType, route: string): void {
    if (!this.actionMethods) {
      this.actionMethods = new Map<string, MethodDefinition>();
    }

    const methodDefinition: MethodDefinition = {
      method,
      route
    };

    this.actionMethods.set(methodSignature, methodDefinition);
  }

  public registerMiddleware(methodSignature: string, location: MiddlewareLocation, middlewareFactories: InjectableMiddlewareFactory[]): void {
    if (!this.registeredMiddleware) {
      this.registeredMiddleware = new Map<string, MiddlewareRegistry>();
    }

    let current: MiddlewareRegistry = this.registeredMiddleware.get(methodSignature);

    if (!current) {
      current = {
        before: [],
        after: []
      };

      this.registeredMiddleware.set(methodSignature, current);
    }

    current[location].push(...middlewareFactories);

  }

  /**
   * Register all routes defined in this controller (or any extending instances)
   * @returns {AbstractController}
   */
  public registerRoutes(): this {

    this.actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      const middlewareFactories = this.registeredMiddleware && this.registeredMiddleware.get(methodSignature);

      this.server.register({
        method: methodDefinition.method,
        path: `/api/${this.routeBase}${methodDefinition.route}`,
        handler: (request: Request, reply: IReply): Promise<HapiResponse> => {

          //polyfill for `const paramMap = new Map(Object.entries(request.params)`
          const paramMap: RouteParamMap = ((object: Object) => {
            let map = new Map();
            for (let key in object) {
              map.set(key, object[key]);
            }
            return map;
          })(request.params);

          let callStack:PromiseFactory<Response>[] = [];

          callStack.push(this[methodSignature]);

          if (middlewareFactories) {
            callStack.unshift(...middlewareFactories.before.map((middleware: MiddlewareFactory) => middleware(this.injector)));
            callStack.push(...middlewareFactories.after.map((middleware: MiddlewareFactory) => middleware(this.injector)));
          }

          return callStack.reduce((current: Promise<Response>, next: PromiseFactory<Response>): Promise<Response> => {

            return current.then((response:Response): Promise<Response> => {
              return Promise.resolve(next.call(this, request, response, paramMap));
            });

          }, Promise.resolve(request.response)) //initial value
            .then((response) => reply(response))
            .catch((err) => reply(err));

        }
      });

      this.logger.debug(`registered ${methodDefinition.method} ${this.routeBase}${methodDefinition.route} to ${this.constructor.name}@${methodSignature}`);
    });

    return this;
  }

}
