import { Injectable, ReflectiveInjector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { InjectableMiddleware, Middleware, InjectableMiddlewareFactory } from './index';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';

@Injectable()
export class DebugLogMiddleware implements InjectableMiddleware {
  protected logger: Logger;

  constructor(loggerBase: Logger) {
    console.log('initialized log middleware', loggerBase);
    this.logger = loggerBase.source('Log middleware');
  }

  public middlewareFactory(messages: string[]): Middleware {

    return (request: Request, response: Response): Response => {
      this.logger.debug(...messages);
      return response;
    }
  }
}

export function debugLog(...messages: string[]): InjectableMiddlewareFactory {

  return (injector: ReflectiveInjector): Middleware => {
    return injector.get(DebugLogMiddleware)
      .middlewareFactory(messages)
  }

}
