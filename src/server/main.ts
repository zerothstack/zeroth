import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, provide } from '@angular/core';
import { Server } from './servers/abstract.server';
import { HapiServer } from './servers/hapi.server';
import { AbstractController } from './controllers/abstract.controller';
import { Database } from './services/database.service';
import { RemoteCli } from './services/remoteCli.service';
import { Logger } from '../common/services/logger.service';
import { ConsoleLogger } from '../common/services/consoleLogger.service';

export const coreInjector = ReflectiveInjector.resolveAndCreate([
  AbstractController,
  Database,
  RemoteCli,
  provide(Server, {useClass: HapiServer}),
  provide(Logger, {useClass: ConsoleLogger}),
]);

