/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Server, HttpMethod } from '../servers/abstract.server';
import { Injectable, Injector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { InjectableMiddlewareFactory, MiddlewareFactory } from '../middleware/index';
import { PromiseFactory } from '../../common/util/serialPromise';
import { Response } from './response';
import { Request } from './request';
import { initializeMiddlewareRegister } from '../middleware/middleware.decorator';
import { HttpException, InternalServerErrorException } from '../exeptions/exceptions';

export const httpMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export interface MethodDefinition {
  method: HttpMethod;
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
  private injector: Injector;

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
  public registerInjector(injector: Injector) {
    this.injector = injector;
    return this;
  }

  /**
   * Register an action. This is used by the @Route() decoratore, but can also be used directly
   * for custom route registration
   * @param methodSignature
   * @param method
   * @param route
   */
  public registerActionMethod(methodSignature: string, method: HttpMethod, route: string): void {
    if (!this.actionMethods) {
      this.actionMethods = new Map<string, MethodDefinition>();
    }

    const methodDefinition: MethodDefinition = {
      method,
      route
    };

    this.actionMethods.set(methodSignature, methodDefinition);
  }

  public registerMiddleware(location: MiddlewareLocation, middlewareFactories: InjectableMiddlewareFactory[], methodSignature: string): this {

    initializeMiddlewareRegister(this);

    let current: MiddlewareRegistry = this.registeredMiddleware.methods.get(methodSignature);

    if (!current) {
      current = {
        before: [],
        after: []
      };

      this.registeredMiddleware.methods.set(methodSignature, current);
    }

    current[location].push(...middlewareFactories);

    return this;
  }

  /**
   * Register all routes defined in this controller (or any extending instances)
   * @returns {AbstractController}
   */
  public registerRoutes(): this {

    this.actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      let callStack: PromiseFactory<Response>[] = [];

      callStack.push(this[methodSignature]);

      if (this.registeredMiddleware) {
        const methodMiddlewareFactories = this.registeredMiddleware.methods.get(methodSignature);

        //wrap method registered factories with the class defined ones [beforeAll, before, after,
        // afterAll]
        const beforeMiddleware = this.registeredMiddleware.all.before.concat(methodMiddlewareFactories.before);
        const afterMiddleware  = methodMiddlewareFactories.after.concat(this.registeredMiddleware.all.after);

        if (methodMiddlewareFactories) {
          callStack.unshift(...beforeMiddleware.map((middleware: MiddlewareFactory) => middleware(this.injector)));
          callStack.push(...afterMiddleware.map((middleware: MiddlewareFactory) => middleware(this.injector)));
        }
      }

      this.server.register({
        methodName: methodSignature,
        method: methodDefinition.method,
        path: `${process.env.API_BASE}/${this.routeBase}${methodDefinition.route}`,
        callStack: callStack,
        callStackHandler: (request: Request, response: Response): Promise<Response> => {
          return callStack.reduce((current: Promise<Response>, next: PromiseFactory<Response>): Promise<Response> => {

              return current.then((response: Response): Promise<Response> => {
                return Promise.resolve(next.call(this, request, response));
              });

            }, Promise.resolve(response)) //initial value
            .catch((e) => {

              if (!(e instanceof HttpException)) {
                e = new InternalServerErrorException(e.message);
              }
              response.status(e.getStatusCode());

              const message = e.getData() || e.toString();

              response.data({message});
              return response;
            });
        }
      });

      this.logger.debug(`registered ${methodDefinition.method} ${this.routeBase}${methodDefinition.route} to ${this.constructor.name}@${methodSignature}`);
    });

    return this;
  }

}
