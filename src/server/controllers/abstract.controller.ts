import { Server } from '../servers/abstract.server';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { InjectableMiddlewareFactory, MiddlewareFactory } from '../middleware/index';
import { PromiseFactory } from '../../common/util/serialPromise';
import { Response } from './response';
import { Request } from './request';
import { initializeMiddlewareRegister } from '../middleware/middleware.decorator';

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
  public registeredMiddleware: {
    methods: Map<string, MiddlewareRegistry>
    all: MiddlewareRegistry
  };

  protected routeBase: string;
  protected logger: Logger;
  private injector: ReflectiveInjector;

  constructor(protected server: Server, logger: Logger) {
    this.logger = logger.source('controller');
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

  public registerMiddleware(location: MiddlewareLocation, middlewareFactories: InjectableMiddlewareFactory[], methodSignature?: string): this {

    initializeMiddlewareRegister(this);

    if (methodSignature){
      let current: MiddlewareRegistry = this.registeredMiddleware.methods.get(methodSignature);

      if (!current) {
        current = {
          before: [],
          after: []
        };

        this.registeredMiddleware.methods.set(methodSignature, current);
      }

      current[location].push(...middlewareFactories);
    } else { // not method signature, apply to all
      this.registeredMiddleware.all[location].push(...middlewareFactories);
    }

    return this;

  }

  /**
   * Register all routes defined in this controller (or any extending instances)
   * @returns {AbstractController}
   */
  public registerRoutes(): this {

    this.actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      let callStack: PromiseFactory<Response>[] = [];

      if (this.registeredMiddleware){
        const methodMiddlewareFactories = this.registeredMiddleware.methods.get(methodSignature);
        //wrap method registered factories with the class defined ones
        methodMiddlewareFactories.before.unshift(...this.registeredMiddleware.all.before);
        methodMiddlewareFactories.after.push(...this.registeredMiddleware.all.after);

        callStack.push(this[methodSignature]);

        if (methodMiddlewareFactories) {
          callStack.unshift(...methodMiddlewareFactories.before.map((middleware: MiddlewareFactory) => middleware(this.injector)));
          callStack.push(...methodMiddlewareFactories.after.map((middleware: MiddlewareFactory) => middleware(this.injector)));
        }
      }


      this.server.register({
        method: methodDefinition.method,
        path: `/api/${this.routeBase}${methodDefinition.route}`,
        callStack: callStack,
        callStackHandler: (request: Request, response: Response): Promise<Response> => {
          return callStack.reduce((current: Promise<Response>, next: PromiseFactory<Response>): Promise<Response> => {

            return current.then((response: Response): Promise<Response> => {
              return Promise.resolve(next.call(this, request, response));
            });

          }, Promise.resolve(response)); //initial value
        }
      });

      this.logger.debug(`registered ${methodDefinition.method} ${this.routeBase}${methodDefinition.route} to ${this.constructor.name}@${methodSignature}`);
    });

    return this;
  }

}
