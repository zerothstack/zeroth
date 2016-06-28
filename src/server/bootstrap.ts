import 'core-js';
import 'reflect-metadata';
import {
  ReflectiveInjector,
  Provider,
  Type,
  ResolvedReflectiveProvider
} from '@angular/core';
import { Server } from './servers/abstract.server';
import { AbstractController } from './controllers/abstract.controller';
import { Logger, LogLevel } from '../common/services/logger.service';
import { coreInjector } from './main';
import { registry, EntityType } from '../common/registry/entityRegistry';

export type ProviderType = Type | Provider | {
  [k: string]: any;
} | any[];

export type ProviderDefinition = ProviderType | Promise<ProviderType> | Promise<ProviderType[]>;

export interface BootstrapResponse {
  injector: ReflectiveInjector;
  server: Server;
  logger: Logger;
}

export interface ClassDictionary<T extends AbstractController> {
  [key: string]: T;
}

export interface DeferredLog {
  level: LogLevel;
  messages: any[];
}

let deferredLogs: DeferredLog[] = [];
export function deferredLog(level: LogLevel, ...messages: any[]) {
  deferredLogs.push({level, messages});
}

function handleBootstrapError(e: Error, logger: Logger) {
  // console.log('e', e);
  if (logger) {
    deferredLogs.forEach((log: DeferredLog) => {
      logger[log.level](...log.messages);
    });

    logger.critical(e.constructor.name, e.message)
      .debug(e.stack);

  } else {
    console.error('Failed to initialize Logger, falling back to console');

    deferredLogs.forEach((log: DeferredLog) => {
      console.log(log.level, ...log.messages);
    });

    console.error(e);
  }
  process.exit(1);
}

function resolveRegistryMap(type:EntityType):ResolvedReflectiveProvider[] {
  return ReflectiveInjector.resolve([...registry.getAllOfType(type).values()]);
}

export function bootstrap(loadClasses:ClassDictionary<any>[], providers: ProviderDefinition[] = [], afterBootstrap?:(bootstrap:BootstrapResponse)=>void): () => Promise<BootstrapResponse> {

  let logger: Logger;

  try {

    deferredLog('info', registry);
    return (): Promise<BootstrapResponse> => {

      deferredLog('info', 'Bootstrapping server');

      return Promise.all(providers)
        .then((providers: ProviderType[]) => {

          let resolvedControllerProviders = resolveRegistryMap('controller');
          let resolvedSeederProviders = resolveRegistryMap('seeder');

          // resolve all other user classes
          const resolvedProviders: ResolvedReflectiveProvider[] = ReflectiveInjector
            .resolve(providers)
            .concat(resolvedControllerProviders)
            .concat(resolvedSeederProviders)
          ;

          // get an injector from the resolutions, using the core injector as parent
          const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, coreInjector);

          // assign logger instance as soon as possible so the error handler might use it
          logger = injector.get(Logger)
            .source('bootstrap');

          deferredLogs.forEach((log: DeferredLog) => {
            logger[log.level](...log.messages);
          });

          // iterate seeders, to fill the db @todo change to register "unseeded" with the remote cli
          // so they can be executed on demand
          resolvedSeederProviders.forEach((resolvedSeederProvider: ResolvedReflectiveProvider) => {
            logger.info(`seeding ${resolvedSeederProvider.key.displayName}`);
            injector.instantiateResolved(resolvedSeederProvider)
              .seed();

          });

          // iterate over the controller providers, instantiating them to register their routes
          resolvedControllerProviders.forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
            logger.info(`initializing ${resolvedControllerProvider.key.displayName}`);
            injector.instantiateResolved(resolvedControllerProvider)
              .registerInjector(injector)
              .registerRoutes();

          });

          // get vars for the bootstrapper
          const server: Server = injector.get(Server);

          let response = {injector, server, logger};

          if (afterBootstrap){
            afterBootstrap(response)
          }

          return response;

        })
        .catch((e) => {
          handleBootstrapError(e, logger);
        });

    }

  } catch (e) {
    handleBootstrapError(e, logger);
  }

}

