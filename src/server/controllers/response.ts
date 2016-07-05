/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EventEmitter } from 'events';
export class Response extends EventEmitter {

  public statusCode: number           = 200;
  public statusMessage: string;
  public headers: Map<string, string> = new Map();
  public body: any;

  public data(data: any): this {
    this.body = data;
    this.emit('data', data);
    this.emit('end');
    return this;
  }

  public status(code: number): this {
    this.statusCode = code;
    return this;
  }

  public header(name: string, value: string): this {
    this.headers.set(name, value);
    return this;
  }

  public created(data: any): this {
    return this
      .status(201)
      .data(data);
  }

}
