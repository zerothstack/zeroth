/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Service } from '../../common/registry/decorators';
import { AbstractService } from '../../common/services/service';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';

/**
 * Class allows developers to register custom commands that can be remote executed in a
 * shell environment. Useful for things like migrations and debugging.
 */
@Injectable()
@Service()
export class AuthService extends AbstractService {

  /**
   * Logger instance for the class, initialized with `remote-cli` source
   */
  private logger: Logger;

  constructor(loggerBase: Logger) {
    super();
    this.logger = loggerBase.source('authentication');
  }

  public verify(jwtToken: string, publicKeyPath: string, params: Object = {}): Promise<any> {

    const pem = readFileSync(publicKeyPath);

    return new Promise((resolve, reject) => {

      jwt.verify(jwtToken, pem, params, (err:Error, decoded:any) => {
        if (err){
          return reject(err);
        }

        return resolve(decoded);
      });

    });

  }

}
