/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { InjectableMiddleware, Middleware, InjectableMiddlewareFactory } from './index';
import { Response } from '../controllers/response';
import { Request } from '../controllers/request';

/**
 * Basic debug logger middleware See [[debugLog]] for usage
 */
@Injectable()
export class DebugLogMiddleware implements InjectableMiddleware {
  protected logger: Logger;

  constructor(loggerBase: Logger) {
    this.logger = loggerBase.source('debugLog');
  }

  /**
   * Creates the debugLog middleware with binding to current class for access to logger
   * @param messages
   * @returns {any}
   */
  public middlewareFactory(messages: string[]): Middleware {

    return function debugLog(request: Request, response: Response): Response {
      this.logger.debug(...messages);
      return response;
    }.bind(this);

  }
}

/**
 * Logs messages to the Logger implementation when middleware is invoked
 * Passes through any responses
 *
 * Example usage:
 * ```typescript
 *  @Injectable()
 *  @Controller()
 * class ExampleController extends AbstractController {
 *
 *  constructor(server: Server, logger: Logger) {
 *    super(server, logger);
 *  }
 *
 *  @Route('GET', '/test')
 *  @Before(debugLog('test log input'))
 *  public testMethod(request: Request, response: Response): Response {
 *    return response;
 *  }
 *
 * }
 * ```
 * When `GET /test` is called, "test log input" will be logged before the testMethod is invoked
 *
 * @param messages
 * @returns {function(ReflectiveInjector): Middleware}
 */
export function debugLog(...messages: string[]): InjectableMiddlewareFactory {

  return (injector: ReflectiveInjector): Middleware => {
    return injector.get(DebugLogMiddleware)
      .middlewareFactory(messages);
  }

}
