/**
 * @module server
 */
/** End Typedoc Module Declaration */
import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, Type } from '@angular/core';
import { Server } from '../servers/abstract.server';
import { AbstractController } from '../controllers/abstract.controller';
import { Logger, LogLevel } from '../../common/services/logger.service';
import { CORE_PROVIDERS } from '../main';
import { ControllerBootstrapper } from './controllers.bootstrapper';
import { ModelBootstrapper } from './models.bootstrapper';
import { SeederBootstrapper } from './seeders.bootstrapper';
import { EntityBootstrapper } from './entity.bootstrapper';
import { MigrationBootstrapper } from './migrations.bootstrapper';
import { ServiceBootstrapper } from './services.bootstrapper';
import { LoggerMock } from '../../common/services/logger.service.mock';

export type ProviderType = Type | {
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

/**
 * Handles the logging of any error encountered during bootstrap. If there is an instance of [[Logger]]
 * available, it is used, otherwise a fallback to console.error is used.
 *
 * In either case, all of the deferred logs are output first, then the error is logged and the
 * process is aborted
 * @param e
 * @param logger
 */
function handleBootstrapError(e: Error, logger: Logger) {
  if (logger) {
    deferredLogs.forEach((log: DeferredLog) => {
      logger[log.level](...log.messages);
    });

    logger.critical(e.constructor.name, e.message)
      .debug(e.stack);

    if (logger instanceof LoggerMock){
      console.log('Logger is mock but a critical error occurred, outputting to console');
      console.error(e);
    }

  } else {
    console.error('Failed to initialize Logger, falling back to console');

    deferredLogs.forEach((log: DeferredLog) => {
      console.log(log.level, ...log.messages);
    });

    console.error(e);
  }
  process.exit(1);
}

/**
 * The core bootstrapping factory function.
 *
 * This function resolves all of the providers, invokes all boostrappers, and finally returns the
 * [[Server]] instance for the bootstrapping start file to call [[Server.start]] on to start the
 * server running
 * @see http://ubiquits.com/guide/application-lifecycle/#startup for detailed documentation
 * @param loadClasses
 * @param providers
 * @param afterBootstrap
 * @returns {function(): Promise<BootstrapResponse>}
 */
export function bootstrap(loadClasses: ClassDictionary<any>[] = [], providers: ProviderDefinition[] = [], afterBootstrap?: (bootstrap: BootstrapResponse)=>void): () => Promise<BootstrapResponse> {

  let logger: Logger;


  deferredLog('debug', 'Classes loaded from app', loadClasses.reduce((all: string[], classDict: ClassDictionary<any>) => {
    return all.concat(Object.keys(classDict));
  }, []));

  return (): Promise<BootstrapResponse> => {

    deferredLog('info', 'Bootstrapping server');
    return Promise.all(CORE_PROVIDERS.concat(providers))
      .then((providers: ProviderType[]) => {

        //initialize all bootstrappers (in order they need to be created)
        const resolvedBootstrappers: EntityBootstrapper[] = [
          new ModelBootstrapper,
          new ServiceBootstrapper,
          new MigrationBootstrapper,
          new SeederBootstrapper,
          new ControllerBootstrapper,
        ];

        const bootrapperProviders:any[] = resolvedBootstrappers.reduce((result: any[], bootstrapper: EntityBootstrapper) => {
          return result.concat(bootstrapper.getInjectableEntities());
        }, []);


        const mergedProviders = ReflectiveInjector.resolve(bootrapperProviders.concat(providers));

        const injector = ReflectiveInjector.fromResolvedProviders(mergedProviders);

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

              return Promise.resolve(next.setInjector(injector)
                .invokeBootstrap());
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

