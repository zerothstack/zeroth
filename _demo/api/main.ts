import { coreInjector } from '../../api/main';
import { ReflectiveInjector, ResolvedReflectiveProvider } from '@angular/core';
import { Server } from '../../api/servers/abstract.server';
import * as Controllers from './controllers';
import * as _ from 'lodash';

// console.log('typeof ControllerMap', typeof ControllerMap);

// const controllers = ControllerMap.values();

let resolvedProviders = ReflectiveInjector.resolve(_.values(Controllers));

let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, coreInjector);

export const server: Server = injector.get(Server);

resolvedProviders.forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
  console.log('initializing', resolvedControllerProvider.key);
  injector.instantiateResolved(resolvedControllerProvider);
});
