import 'core-js';
import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { Server } from './servers/abstract.server';
import { AbstractController } from './controllers/abstract.controller';
import { Database } from './services/database.service';
import { RemoteCli } from './services/remoteCli.service';
import { Logger } from '../common/services/logger.service';
import { ConsoleLogger } from '../common/services/consoleLogger.service';
import { DebugLogMiddleware } from './middleware/debugLog.middleware';
import { ExpressServer } from './servers/express.server';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as _ from 'lodash';

/**
 * Load .env variables into process.env.*
 */
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

process.env = _.mapKeys(process.env, (value: any, key: string) => key.replace(/^PUBLIC_/, ''));

/**
 * The core injector is exported so implementations can pick up already registered injectables
 * without having to register them themselves.
 * @type {ReflectiveInjector}
 */
export const coreInjector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
  AbstractController,
  Database,
  RemoteCli,
  DebugLogMiddleware,
  // {provide: Server, useClass: HapiServer},
  {provide: Server, useClass: ExpressServer},
  {provide: Logger, useClass: ConsoleLogger},
]);
