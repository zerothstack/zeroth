import { coreInjector } from '../../api/main';
import { ReflectiveInjector, ResolvedReflectiveProvider, provide } from '@angular/core';
import { Server } from '../../api/servers/abstract.server';
import * as Controllers from './controllers';
import * as _ from 'lodash';
import { ConsoleLoggerService } from '../../api/services/consoleLogger.service';
import { LoggerService } from '../../api/services/logger.service';
import * as dotenv from 'dotenv';

/**
 * Load .env variables into process.env.*
 */
dotenv.config();

// resolve all controllers
let resolvedControllerProviders = ReflectiveInjector.resolve(_.values(Controllers));

// resolve all other user classes
let resolvedProviders = ReflectiveInjector.resolve([
  provide(LoggerService, {useClass: ConsoleLoggerService}),
]).concat(resolvedControllerProviders);

// get an injector from the resolutions, using the core injector as parent
let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, coreInjector);

// export vars for the bootstrapper
export const server: Server        = injector.get(Server);
export const logger: LoggerService = injector.get(LoggerService);

// iterate over the controller providers, instantiating them to register their routes
resolvedControllerProviders.forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
  logger.info('initializing %s', resolvedControllerProvider.key.displayName);
  injector.instantiateResolved(resolvedControllerProvider);
});
