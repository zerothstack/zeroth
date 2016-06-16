import { IncomingMessage } from 'http';

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

}
