/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable } from '@angular/core';
import { Logger } from '../../common/services/logger.service';
import { Service } from '../../common/registry/decorators';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './authService.service';

/**
 * Class allows developers to register custom commands that can be remote executed in a
 * shell environment. Useful for things like migrations and debugging.
 */
@Injectable()
@Service()
export class AuthServiceMock extends AuthService {

  constructor(loggerBase: Logger) {
    super(loggerBase);
  }

  public verify(jwtToken: string, publicKeyPath: string, params: Object = {}): Promise<any> {

    return Promise.resolve(jwt.decode(jwtToken));
  }

}
