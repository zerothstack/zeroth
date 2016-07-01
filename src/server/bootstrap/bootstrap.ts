import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, Provider, Type, ResolvedReflectiveProvider } from '@angular/core';
import { Server } from '../servers/abstract.server';
import { AbstractController } from '../controllers/abstract.controller';
import { Logger, LogLevel } from '../../common/services/logger.service';
import { coreInjector } from '../main';
import { registry } from '../../common/registry/entityRegistry';
import { ControllerBootstrapper } from './controllers.bootstrapper';
import { ModelBootstrapper } from './models.bootstrapper';
import { SeederBootstrapper } from './seeders.bootstrapper';
import { EntityBootstrapper } from './entity.bootstrapper';
import { MigrationBootstrapper } from './migrations.bootstrapper';

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

export function bootstrap(loadClasses: ClassDictionary<any>[], providers: ProviderDefinition[] = [], afterBootstrap?: (bootstrap: BootstrapResponse)=>void): () => Promise<BootstrapResponse> {

  let logger: Logger;

  deferredLog('debug', registry);
  return (): Promise<BootstrapResponse> => {

    deferredLog('info', 'Bootstrapping server');

    return Promise.all(providers)
      .then((providers: ProviderType[]) => {

        //initialize all bootstrappers (in order they need to be created)
        const resolvedBootstrappers: EntityBootstrapper[] = [
          new ModelBootstrapper,
          new MigrationBootstrapper,
          new SeederBootstrapper,
          new ControllerBootstrapper,
        ];

        // extract all of the resolved entities from the bootstrappers for registration with the
        // injector
        const bootrapperProviders = resolvedBootstrappers.reduce((result: ResolvedReflectiveProvider[], bootstrapper: EntityBootstrapper) => {
          return result.concat(bootstrapper.getResolvedEntities());
        }, []);

        // resolve all other user classes
        const resolvedProviders: ResolvedReflectiveProvider[] = ReflectiveInjector
          .resolve(providers)
          .concat(bootrapperProviders)
          ;

        // get an injector from the resolutions, using the core injector as parent
        const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, coreInjector);

        // assign logger instance as soon as possible so the error handler might use it
        logger = injector.get(Logger)
          .source('bootstrap');

        // iterate over any logs that have been deferred
        deferredLogs.forEach((log: DeferredLog) => {
          logger[log.level](...log.messages);
        });
        deferredLogs = []; //clear buffer

        // iterate over all of the resolved bootstrappers, invoking the bootstrap to initialize the
        // entities. iteration is completed in serial so that bootstrappers that depend on other
        // entities won't invoke until those other entities are finished intializing
        return resolvedBootstrappers.reduce((current: Promise<void>, next: EntityBootstrapper): Promise<void> => {

            return current.then((): Promise<void> => {
              return Promise.resolve(next.invokeBootstrap(injector));
            });

          }, Promise.resolve()) //initial value
          .then(() => {
            // get vars for the bootstrapper
            const server: Server = injector.get(Server);

            let response = {injector, server, logger};

            if (afterBootstrap) {
              return Promise.resolve(afterBootstrap(response))
                .then(() => response);
            }

            return response;
          });

      })
      .catch((e) => {
        handleBootstrapError(e, logger);
      });

  }

}

