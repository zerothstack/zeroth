import { Injectable, ReflectiveInjector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { InjectableMiddleware, Middleware, InjectableMiddlewareFactory } from './index';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';

@Injectable()
export class DebugLogMiddleware implements InjectableMiddleware {
  protected logger: Logger;

  constructor(loggerBase: Logger) {
    this.logger = loggerBase.source('debugLog');
  }

  public middlewareFactory(messages: string[]): Middleware {

    return function debugLog(request: Request, response: Response): Response {
      this.logger.debug(...messages);
      return response;
    }.bind(this);

  }
}

export function debugLog(...messages: string[]): InjectableMiddlewareFactory {

  return (injector: ReflectiveInjector): Middleware => {
    return injector.get(DebugLogMiddleware)
      .middlewareFactory(messages);
  }

}
