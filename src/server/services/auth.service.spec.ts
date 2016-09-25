import * as proxyquire from 'proxyquire';
import { Logger } from '../../common/services/logger.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { AuthServiceMock } from './auth.service.mock';
import { AuthService } from './auth.service';

const jwtSpy  = jasmine.createSpyObj('jwt', ['verify', 'decode']);
const payload = {
  username: 'bob',
};
jwtSpy.verify.and.returnValue(Promise.resolve(payload));
jwtSpy.decode.and.returnValue(Promise.resolve(payload));

describe('Auth Service (JWT)', () => {

  const fileReadSpy = jasmine.createSpy('readFileSync');

  const pem = `
--- BEGIN FAKE KEY ---
--- END FAKE KEY ---
`;

  fileReadSpy.and.returnValue(pem);

  const mockedModule = proxyquire('./auth.service', {
    jsonwebtoken: jwtSpy,
    fs: {
      readFileSync: fileReadSpy
    }
  });

  const providers = [
    {
      provide: AuthService,
      deps: [Logger],
      useFactory: (logger: Logger) => {
        return new mockedModule.AuthService(logger);
      }
    },
    {provide: Logger, useClass: LoggerMock},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  afterEach(() => {
    jwtSpy.verify.calls.reset();
  });

  it('verifies credentials with jwt and public key', async(inject([AuthService], (s: AuthService) => {

    const jwt           = 'pretend.this.is.a.jwt';
    const publicKeyPath = './path/to/key';
    const params        = {
      iat: 12345679
    };

    const resPromise = s.verify(jwt, publicKeyPath, params);

    expect(fileReadSpy)
      .toHaveBeenCalledWith(publicKeyPath);

    expect(jwtSpy.verify)
      .toHaveBeenCalledWith(jwt, pem, params, jasmine.any(Function));

    const callArgCb = jwtSpy.verify.calls.mostRecent().args[3];

    callArgCb(null, payload);

    return resPromise.then((res) => {
      expect(res)
        .toEqual(payload);
    });

  })));

  it('rejects verification of credentials when jwt.verify fails', async(inject([AuthService], (s: AuthService) => {

    const jwt           = 'pretend.this.is.an.invalid.jwt';
    const publicKeyPath = './path/to/key';

    const resPromise = s.verify(jwt, publicKeyPath);

    expect(fileReadSpy)
      .toHaveBeenCalledWith(publicKeyPath);

    expect(jwtSpy.verify)
      .toHaveBeenCalledWith(jwt, pem, {}, jasmine.any(Function));

    const callArgCb = jwtSpy.verify.calls.mostRecent().args[3];

    callArgCb(new Error('jwt error'), payload);

    return resPromise.catch((e) => {
      expect(e.message)
        .toEqual('jwt error');
    });

  })));

});

describe('Auth Service (JWT) Mock', () => {

  const mockedModule = proxyquire('./auth.service.mock', {
    jsonwebtoken: jwtSpy,
  });

  const providers = [
    {
      provide: AuthServiceMock,
      deps: [Logger],
      useFactory: (logger: Logger) => {
        return new mockedModule.AuthServiceMock(logger);
      }
    },
    {provide: Logger, useClass: LoggerMock},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  it('returns decoded jwt directly without checking', async(inject([AuthServiceMock], (s: AuthServiceMock) => {

    const jwt = 'pretend.this.is.a.valid.jwt';

    const resPromise = s.verify(jwt);

    expect(jwtSpy.decode)
      .toHaveBeenCalledWith(jwt);

    return resPromise.then((res) => {
      expect(res)
        .toEqual(payload);
    });

  })));

});
