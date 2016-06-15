import { Request as HapiRequest } from 'hapi';

export type OriginalRequest = HapiRequest;

export class Request {

  constructor(private original?: OriginalRequest) {

  }

  public getOriginal(): OriginalRequest {
    return this.original;
  }

  public headers(): Map<string, string> {
    return Request.extractMapFromDictionary<string, string>(this.original.headers);
  }

  public params(): Map<string, string> {
    return Request.extractMapFromDictionary<string, string>(this.original.params);
  }


  private static extractMapFromDictionary<K, V>(dictionary:Object):Map<K, V> {
    let map = new Map();

    for (let key in dictionary) {
      map.set(key, dictionary[key]);
    }

    return map;
  }

}
