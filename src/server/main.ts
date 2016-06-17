import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector, provide } from '@angular/core';
import { Server } from './servers/abstract.server';
import { AbstractController } from './controllers/abstract.controller';
import { Database } from './services/database.service';
import { RemoteCli } from './services/remoteCli.service';
import { Logger } from '../common/services/logger.service';
import { ConsoleLogger } from '../common/services/consoleLogger.service';
import { DebugLogMiddleware } from './middleware/debugLog.middleware';
import { ExpressServer } from './servers/express.server';
export {provide} from '@angular/core';
import * as dotenv from 'dotenv';

/**
 * Load .env variables into process.env.*
 */
dotenv.config({
  path: './env/.default.env'
});

/**
 * The core injector is exported so implementations can pick up already registered injectables
 * without having to register them themselves.
 * @type {ReflectiveInjector}
 */
export const coreInjector:ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
  AbstractController,
  Database,
  RemoteCli,
  DebugLogMiddleware,
  // provide(Server, {useClass: HapiServer}),
  provide(Server, {useClass: ExpressServer}),
  provide(Logger, {useClass: ConsoleLogger}),
]);
