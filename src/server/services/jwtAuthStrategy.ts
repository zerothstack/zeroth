/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { bannerBg } from '../../common/util/banner';
import * as chalk from 'chalk';
import * as path from 'path';
import {
  AuthenticationStrategy,
  RemoteCliContext,
  AuthenticationStrategyFactory,
  AuthenticationCallback
} from './remoteCli.service';

export const jwtAuthStrategyFactory:AuthenticationStrategyFactory = (remoteCliContext: RemoteCliContext): AuthenticationStrategy => {
  return function (vantage: any, options: any) {
    return function (args: {client: {jwt: string, publicKeyPath: string, columns: number}}, cb: AuthenticationCallback) {

      try {
        remoteCliContext.logger.silly.debug('Passed client arguments: ', args);

        const token: string   = args.client.jwt;
        let keyPath: string = args.client.publicKeyPath;

        if (!token) {
          return cb("JWT was not passed in connection request", false);
        }

        if (process.env.PATH_ROOT){
          keyPath = path.resolve(process.env.PATH_ROOT, keyPath);
        }

        remoteCliContext.logger.info(`Authenticating JSON web token against public key [${keyPath}]`);

        remoteCliContext.authService.verify(token, keyPath)
          .then((payload: any) => {
            remoteCliContext.logger.info(`${payload.username} has been authenticated with token`)
              .debug('Token:', token);
            let displayBanner = `Hi ${payload.username}, Welcome to Zeroth runtime cli.`;
            if (args.client.columns >= 80) {
              displayBanner = bannerBg(undefined, token);
            }
            this.log(chalk.grey(`You were authenticated with a JSON Web token verified against the public key at ${keyPath}`));
            this.log(displayBanner);
            this.log(` Type 'help' for a list of available commands`);

            return cb(null, true);
          })
          .catch((e: Error) => {
            return cb(e.message, false);
          });

      } catch (e) {
        remoteCliContext.logger.error('Authentication error', e.message).debug(e.stack);
        cb(e.message, false);
      }
    };
  }
};
