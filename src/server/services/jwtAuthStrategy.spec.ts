import { AuthenticationStrategy, RemoteCliContext } from './remoteCli.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { jwtAuthStrategyFactory } from './jwtAuthStrategy';
import * as chalk from 'chalk';

import Spy = jasmine.Spy;

describe('JWT Authentication Strategy', () => {

  const loggerMock  = new LoggerMock();
  const authService = jasmine.createSpyObj('authService', ['verify']);

  const payload = {
    username: 'bob',
  };
  authService.verify.and.returnValue(Promise.resolve(payload));

  process.env.PATH_ROOT = '/tmp'; //tmp for testing

  const context: RemoteCliContext = {
    logger: loggerMock,
    authService: authService,
  };

  let authStrategy: AuthenticationStrategy;

  beforeEach(() => {
    authStrategy = jwtAuthStrategyFactory(context);
  });

  it('rejects callback when jwt is not passeed', () => {

    const callbackSpy = jasmine.createSpy('cb');

    authStrategy(null, null)({client: {}}, callbackSpy);

    expect(callbackSpy)
      .toHaveBeenCalledWith("JWT was not passed in connection request", false);

  });

  it('verifies with the passed jwt and authentication key path', (cb) => {

    const jwt           = 'pretend.this.is.a.jwt';
    const publicKeyPath = './path/to/key';

    const vantageScope = jasmine.createSpyObj('vantageScope', ['log']);

    const authenticator = authStrategy(null, null)
      .bind(vantageScope);

    authenticator({client: {jwt, publicKeyPath, columns: 100}}, (message:string, isSuccess:boolean) => {

      expect(authService.verify).toHaveBeenCalledWith(jwt, '/tmp/path/to/key');

      expect(vantageScope.log)
        .toHaveBeenCalledWith(chalk.grey(`You were authenticated with a JSON Web token verified against the public key at /tmp/path/to/key`));

      expect(isSuccess).toBe(true);
      expect(message).toBe(null);
      cb();
    });

  });


  it('rejects the callback if loading the auth service fails', (cb) => {

    const vantageScope = jasmine.createSpyObj('vantageScope', ['log']);

    const authenticator = authStrategy(null, null)
      .bind(vantageScope);

    const jwt           = 'pretend.this.is.a.jwt';
    const publicKeyPath = './path/to/key';

    authService.verify.and.throwError('authentication lib error');

    authenticator({client: {jwt, publicKeyPath}}, (message:string, isSuccess:boolean) => {

      expect(isSuccess).toBe(false);
      expect(message).toBe('authentication lib error');
      cb();
    });

  });

  it('rejects the callback when the authentication service errors', (cb) => {

    const vantageScope = jasmine.createSpyObj('vantageScope', ['log']);

    const authenticator = authStrategy(null, null)
      .bind(vantageScope);

    const jwt           = 'pretend.this.is.a.jwt';
    const publicKeyPath = './path/to/key';

    authService.verify.and.returnValue(Promise.reject(new Error('authentication failed')));

    authenticator({client: {jwt, publicKeyPath}}, (message:string, isSuccess:boolean) => {

      expect(isSuccess).toBe(false);
      expect(message).toBe('authentication failed');
      cb();
    });

  });

});
