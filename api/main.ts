import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, provide } from '@angular/core';
import { Server } from './servers/abstract.server';
import { HapiServer } from './servers/hapi.server';
import { AbstractController } from './controllers/abstract.controller';

export const coreInjector = ReflectiveInjector.resolveAndCreate([
  AbstractController,
  provide(Server, {useClass: HapiServer}),
]);

