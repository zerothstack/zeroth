/**
 * @module server
 */
/** End Typedoc Module Declaration */
import 'core-js';
import 'reflect-metadata';
import { Server } from './servers/abstract.server';
import { Database } from './services/database.service';
import { RemoteCli } from './services/remoteCli.service';
import { Logger } from '../common/services/logger.service';
import { ConsoleLogger } from '../common/services/consoleLogger.service';
import { DebugLogMiddleware } from './middleware/debugLog.middleware';
import { ExpressServer } from './servers/express.server';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as _ from 'lodash';
import { ProviderDefinition } from './bootstrap/bootstrap';

// Load .env variables into process.env.*
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

// Strip the prefix PUBLIC_ from any exported .env vars
process.env = _.mapKeys(process.env, (value: any, key: string) => key.replace(/^PUBLIC_/, ''));

/**
 * Core providers, can be overridden by implementing app with it's own provider definitions
 * @type {ProviderDefinition[]}
 */
export const CORE_PROVIDERS: ProviderDefinition[] = [
  Database,
  RemoteCli,
  DebugLogMiddleware,
  // {provide: Server, useClass: HapiServer},
  {provide: Server, useClass: ExpressServer},
  {provide: Logger, useClass: ConsoleLogger},
];
