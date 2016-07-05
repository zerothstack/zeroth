/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EventEmitter } from 'events';

/**
 * Response class that is passed into all middleware and controller methods to be manipulated
 * and eventually dispatched to the client.
 *
 * Response is also an `EventEmitter` so you can attach listeners to the response:
 * * [[Response.EVENT_DATA]]
 * * [[Response.EVENT_END]]
 *
 */
export class Response extends EventEmitter {

  /** @event Emitted when response body data is set */
  public static EVENT_DATA:string = 'data';
  /** @event Emitted when response body setting is completed */
  public static EVENT_END:string = 'end';

  /** The HTTP status code that is sent */
  public statusCode: number           = 200;
  /** Custom message (if any) associated with custom status codes */
  public statusMessage: string;
  /** Map of headers to send back */
  public headers: Map<string, string> = new Map();
  /** Body content, should almost always be JSON */
  public body: any;

  /**
   * Set the data to be sent back in the body.
   * This also emits a `data` event containing the response body and immediately sends `end` event
   * @param data
   * @returns {Response}
   */
  public data(data: any): this {
    this.body = data;
    this.emit(Response.EVENT_DATA, data);
    this.emit(Response.EVENT_END);
    return this;
  }

  /**
   * Set the status code to be sent
   * @param code
   * @returns {Response}
   */
  public status(code: number): this {
    this.statusCode = code;
    return this;
  }

  /**
   * Add or overwrite a header
   * @param name
   * @param value
   * @returns {Response}
   */
  public header(name: string, value: string): this {
    this.headers.set(name, value);
    return this;
  }

  /**
   * Utility method to send the correct status code for created entity
   * @param data
   * @returns {Response}
   */
  public created(data: any): this {
    return this
      .status(201)
      .data(data);
  }

}
