import { Request } from '../controllers/request';
import { IncomingMessage } from 'http';
import { EventEmitter } from 'events';
import { PayloadTooLargeException, UnprocessableEntityException } from '../exeptions/exceptions';

describe('Request', () => {

  it('Returns promise of the payload data', (done: Function) => {
    const payload = {message: 'hello there'};

    let emitter = new EventEmitter();

    (emitter as any).setEncoding = (): any => null;

    let request = new Request(emitter as IncomingMessage);

    request.getPayload()
      .then((result) => {
        expect(result)
          .toEqual(payload);
        done();
      });

    process.nextTick(() => {
      emitter.emit(Request.EVENT_DATA, JSON.stringify(payload));
      emitter.emit(Request.EVENT_END);
    });

  });

  it('Throws exception when payload is not json', (done: Function) => {

    let emitter = new EventEmitter();

    (emitter as IncomingMessage).setEncoding = (): any => null;

    let request = new Request(emitter as IncomingMessage);

    request.getPayload()
      .catch((error) => {
        expect(error instanceof UnprocessableEntityException)
          .toBe(true);
        done();
      });

    process.nextTick(() => {
      emitter.emit(Request.EVENT_DATA, 'definitely_not_json');
      emitter.emit(Request.EVENT_END);
    });
  });

  it('Throws exception when payload is too large', (done: Function) => {

    let emitter = new EventEmitter();

    (emitter as IncomingMessage).setEncoding = (): any => null;

    const destroySpy = jasmine.createSpy('socket_destroy');

    (emitter as any).socket = {
      destroy: destroySpy
    };

    let request = new Request(emitter as IncomingMessage);

    request.getPayload()
      .catch((error) => {
        expect(error instanceof PayloadTooLargeException)
          .toBe(true);
        done();
        expect(destroySpy)
          .toHaveBeenCalled();
      });

    process.nextTick(() => {
      emitter.emit(Request.EVENT_DATA, 'a'.repeat(1e6 + 1)); //this may be a fairly intensive test, not sure
                                                 // about the impact
    });

  });

  it('has utility function for converting flat dictionary to map', () => {

    const dict = {
      a: 1,
      b: 2
    };

    const map = Request.extractMapFromDictionary(dict);

    expect(map.get('a'))
      .toEqual(1);
    expect(map.get('b'))
      .toEqual(2);

  });

  it('can get the raw event emitter', () => {

    let emitter = new EventEmitter();

    let request = new Request(emitter as IncomingMessage);

    expect(request.getRaw())
      .toEqual(emitter);

  });

  it('can get the params map', () => {
    let request = new Request(null, new Map([['id', '1']]));
    expect(request.params()
      .get('id'))
      .toEqual('1');
  });

  it('can get the headers map', () => {
    let request = new Request(null, null, new Map([['Authorization', 'Basic: something']]));
    expect(request.headers()
      .get('Authorization'))
      .toEqual('Basic: something');
  });

});
