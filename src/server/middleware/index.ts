import { ReflectiveInjector } from '@angular/core';
import { Response } from '../controllers/abstract.controller';

export interface Middleware {
  (request: any, response: any): Response | Promise<Response>;
}

export interface InjectableMiddleware {
  middlewareFactory(...args: any[]): Middleware;
}

export interface InjectableMiddlewareFactory {
  (injector: ReflectiveInjector): Middleware;
}

export interface IsolatedMiddlewareFactory {
  (injector?: ReflectiveInjector): Middleware;
}

export type MiddlewareFactory = InjectableMiddlewareFactory | IsolatedMiddlewareFactory;

export * from './middleware.decorator';
export * from './debugLog.middleware';
