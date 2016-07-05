/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { IncomingMessage } from 'http';
import { UnprocessableEntityException, PayloadTooLargeException } from '../exeptions/exceptions';
import EventEmitter = NodeJS.EventEmitter;

/**
 * Request class that is passed into all middleware and controller methods to extract data from the
 * client request.
 */
export class Request {

  /** @event Emitted when request body data is read */
  public static EVENT_DATA: string  = 'data';
  /** @event Emitted when request body read is completed */
  public static EVENT_END: string   = 'end';
  /** @event Emitted when response body read is completed */
  public static EVENT_ERROR: string = 'end';

  constructor(protected raw: IncomingMessage = undefined,
              protected paramsMap: Map<string, string> = new Map(),
              protected headersMap: Map<string, string> = new Map()) {

  }

  /**
   * Get the raw IncomingMessage
   * @returns {IncomingMessage}
   */
  public getRaw(): IncomingMessage {
    return this.raw;
  }

  /**
   * Get all headers as a Map
   * @returns {Map<string, string>}
   */
  public headers(): Map<string, string> {
    return this.headersMap;
  }

  /**
   * Get all route paramaters as a Map
   * @returns {Map<string, string>}
   */
  public params(): Map<string, string> {
    return this.paramsMap;
  }

  /**
   * Helper function for converting Dictionary to Map
   * @param dictionary
   * @returns {Map<any, any>}
   */
  public static extractMapFromDictionary<K, V>(dictionary: Object): Map<K, V> {
    let map = new Map();

    for (let key in dictionary) {
      map.set(key, dictionary[key]);
    }

    return map;
  }

  /**
   * Extract the passed body object from the raw request
   * @returns {Promise<T>}
   */
  public getPayload(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.raw.setEncoding('utf8');

      let data: string = '';

      this.raw.on(Request.EVENT_DATA, (d: string) => {
        data += d;
        if (data.length > 1e6) {
          data  = "";
          let e = new PayloadTooLargeException();
          this.raw.socket.destroy();
          reject(e);
        }
      });

      this.raw.on(Request.EVENT_END, () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new UnprocessableEntityException());
        }

      });

      this.raw.on(Request.EVENT_ERROR, reject);
    });
  }
}
