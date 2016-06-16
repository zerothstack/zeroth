import 'core-js';
import 'reflect-metadata';
import {
  ReflectiveInjector,
  Provider,
  Type,
  provide,
  ResolvedReflectiveProvider
} from '@angular/core';
import { Server } from './servers/abstract.server';
import { HapiServer } from './servers/hapi.server';
import { AbstractController } from './controllers/abstract.controller';
import { Database } from './services/database.service';
import { RemoteCli } from './services/remoteCli.service';
import { Logger } from '../common/services/logger.service';
import { ConsoleLogger } from '../common/services/consoleLogger.service';
import { DebugLogMiddleware } from './middleware/debugLog.middleware';
import { ExpressServer } from './servers/express.server';
export {provide} from '@angular/core';
/**
 * The core injector is exported so implementations can pick up already registered injectables
 * without having to register them themselves.
 * @type {ReflectiveInjector}
 */
export const coreInjector = ReflectiveInjector.resolveAndCreate([
  AbstractController,
  Database,
  RemoteCli,
  DebugLogMiddleware,
  provide(Server, {useClass: HapiServer}),
  // provide(Server, {useClass: ExpressServer}),
  provide(Logger, {useClass: ConsoleLogger}),
]);

export type ProviderDefinition = Type | Provider | {
  [k: string]: any;
} | any[];

export interface BootstrapResponse {
  injector: ReflectiveInjector;
  server: Server;
  logger: Logger;
}

export interface ControllerDictionary<T extends AbstractController> {
  [key:string]: T;
}

export function bootstrap(controllers: ControllerDictionary<any>, providers: ProviderDefinition[] = []): BootstrapResponse {

  let logger: Logger;
  try {

    let controllerArray = Object.keys(controllers).map(key => controllers[key]);

    // resolve all controllers
    let resolvedControllerProviders = ReflectiveInjector.resolve(controllerArray);

    // resolve all other user classes
    const resolvedProviders:ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(providers)
      .concat(resolvedControllerProviders);

    // get an injector from the resolutions, using the core injector as parent
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, coreInjector);

    // assign logger instance as soon as possible so the error handler might use it
    logger = injector.get(Logger).source('bootstrap');

    // iterate over the controller providers, instantiating them to register their routes
    resolvedControllerProviders.forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
      logger.info(`initializing ${resolvedControllerProvider.key.displayName}`);
      injector.instantiateResolved(resolvedControllerProvider)
        .registerInjector(injector)
        .registerRoutes();
    });

    // get vars for the bootstrapper
    const server: Server = injector.get(Server);

    return {injector, server, logger};

  } catch (e) {
    if (logger){
      logger.critical(e);
    } else {
      console.error('Failed to initialize Logger, falling back to console');
      console.error(e);
    }
    process.exit(1);
  }

}

