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
import {
  RegistryEntityStatic,
  RegistryEntityConstructor, RegistryEntity
} from '../../common/registry/entityRegistry';
import {
  ModelMetadata, ControllerMetadata,
  initializeMetadata
} from '../../common/metadata/metadata';

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

export interface ControllerConstructor<T extends AbstractController> extends Function {
  constructor: ControllerStatic<T>;
}

export interface ControllerStatic<T extends AbstractController> extends RegistryEntityStatic<ControllerMetadata> {
  new(server: Server, logger: Logger): T;
  prototype: T;
  registerMiddleware(location: MiddlewareLocation, middlewareFactories: InjectableMiddlewareFactory[], methodSignature?: string): void;
}

/**
 * Abstract controller that all controllers *must* extend from. The [[ControllerBootstrapper]]
 * relies on the interface provided by this class to invoke registration of routes and middleware
 */
@Injectable()
export abstract class AbstractController extends RegistryEntity<ControllerMetadata> {

  public static __metadataDefault: ControllerMetadata = {
    routeBase: '/'
  };

  protected actionMethods: Map<string, MethodDefinition>;

  /** Current controller instance */
  protected logger: Logger;
  /** Instance of injector used for the registration of @Injectable middleware */
  private injector: Injector;

  constructor(protected server: Server, logger: Logger) {
    super();
    this.logger = logger.source(this.constructor.name);
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
   * Register an action. This is used by the @Route() decorator, but can also be called directly
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

  /**
   * Middleware registration. This is used by the @Before & @After decorators to assign middleware
   * to the controller method instance.
   * @param location
   * @param middlewareFactories
   * @param methodSignature
   * @returns void
   */
  public static registerMiddleware(location: MiddlewareLocation, middlewareFactories: InjectableMiddlewareFactory[], methodSignature?: string): void {

    initializeMiddlewareRegister(this);

    const middleware = (this.getMetadata() as ControllerMetadata).middleware;
    if (methodSignature) {
      let current: MiddlewareRegistry = middleware.methods.get(methodSignature);

      if (!current) {
        current = {
          before: [],
          after: []
        };

        middleware.methods.set(methodSignature, current);
      }

      current[location].push(...middlewareFactories);
    } else {
      middleware.all[location].push(...middlewareFactories);
    }

  }

  /**
   * Register all routes defined in this controller (or any extending instances)
   * @returns {AbstractController}
   */
  public registerRoutes(): this {

    this.actionMethods.forEach((methodDefinition: MethodDefinition, methodSignature: string) => {

      let callStack: PromiseFactory<Response>[] = [];

      callStack.push(this[methodSignature]);

      if (this.getMetadata().middleware) {
        const methodMiddlewareFactories = this.getMetadata()
          .middleware
          .methods
          .get(methodSignature);

        //wrap method registered factories with the class defined ones [beforeAll, before, after,
        // afterAll]
        const beforeMiddleware = this.getMetadata()
          .middleware
          .all
          .before
          .concat(methodMiddlewareFactories.before);
        const afterMiddleware  = methodMiddlewareFactories.after.concat(this.getMetadata().middleware.all.after);

        if (methodMiddlewareFactories) {
          callStack.unshift(...beforeMiddleware.map((middleware: MiddlewareFactory) => middleware(this.injector)));
          callStack.push(...afterMiddleware.map((middleware: MiddlewareFactory) => middleware(this.injector)));
        }
      }

      this.server.register({
        methodName: methodSignature,
        method: methodDefinition.method,
        path: `${process.env.API_BASE}/${this.getMetadata().routeBase}${methodDefinition.route}`,
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

      this.logger.debug(`registered ${methodDefinition.method} ${this.getMetadata().routeBase}${methodDefinition.route} to ${this.constructor.name}@${methodSignature}`);
    });

    return this;
  }

}
