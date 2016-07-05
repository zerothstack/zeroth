/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { IncomingMessage } from 'http';
import { UnprocessableEntityException, PayloadTooLargeException } from '../exeptions/exceptions';
import EventEmitter = NodeJS.EventEmitter;

export class Request {

  constructor(protected raw: IncomingMessage = undefined,
              protected paramsMap: Map<string, string> = new Map(),
              protected headersMap: Map<string, string> = new Map()) {

  }

  public getRaw(): IncomingMessage {
    return this.raw;
  }

  public headers(): Map<string, string> {
    return this.headersMap;
  }

  public params(): Map<string, string> {
    return this.paramsMap;
  }

  public static extractMapFromDictionary<K, V>(dictionary: Object): Map<K, V> {
    let map = new Map();

    for (let key in dictionary) {
      map.set(key, dictionary[key]);
    }

    return map;
  }

  public getPayload(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.raw.setEncoding('utf8');

      let data:string = '';

      this.raw.on('data', (d:string) => {
        data += d;
        if(data.length > 1e6) {
          data = "";
          let e = new PayloadTooLargeException();
          this.raw.socket.destroy();
          reject(e);
        }
      });

      this.raw.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e){
          reject(new UnprocessableEntityException());
        }

      });

      this.raw.on('error', reject);
    });
  }
}
