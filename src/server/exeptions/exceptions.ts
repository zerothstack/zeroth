// export declare class Error {
//   public name:string;
//   public message:string;
//   public stack:string;
//
//   constructor(message?:string);
// }

export abstract class HttpException extends Error {

  protected statusCode: number = 500;

  constructor(public message: string) {
    super(message);
    // this.name = 'HttpException';
    // this.message = message;
    // this.stack = (<any>new Error()).stack;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

}

// Exception list:
// 400 BadRequest
// 401 Unauthorized
// 402 PaymentRequired
// 403 Forbidden
// 404 NotFound
// 405 MethodNotAllowed
// 406 NotAcceptable
// 407 ProxyAuthenticationRequired
// 408 RequestTimeout
// 409 Conflict
// 410 Gone
// 411 LengthRequired
// 412 PreconditionFailed
// 413 PayloadTooLarge
// 414 URITooLong
// 415 UnsupportedMediaType
// 416 RangeNotSatisfiable
// 417 ExpectationFailed
// 422 UnprocessableEntity
// 429 TooManyRequests
// 451 UnavailableForLegalReasons
// 500 InternalServerError
// 501 NotImplemented
// 503 ServiceUnavailable
// 507 InsufficientStorage


//400
export class BadRequestException extends HttpException {
  protected statusCode:number = 400;

  constructor(message:string = 'Bad Request'){
    super(message);
    this.name = 'BadRequestException';
  }
}
//401
export class UnauthorizedException extends HttpException {
  protected statusCode:number = 401;

  constructor(message:string = 'Unauthorized'){
    super(message);
    this.name = 'UnauthorizedException';
  }
}
//402
export class PaymentRequiredException extends HttpException {
  protected statusCode:number = 402;

  constructor(message:string = 'Payment Required'){
    super(message);
    this.name = 'PaymentRequiredException';
  }
}
//403
export class ForbiddenException extends HttpException {
  protected statusCode:number = 403;

  constructor(message:string = 'Forbidden'){
    super(message);
    this.name = 'ForbiddenException';
  }
}
//404
export class NotFoundException extends HttpException {
  protected statusCode:number = 404;

  constructor(message:string = 'Not Found'){
    super(message);
    this.name = 'NotFoundException';
  }
}
//405
export class MethodNotAllowedException extends HttpException {
  protected statusCode:number = 405;

  constructor(message:string = 'Method Not Allowed'){
    super(message);
    this.name = 'MethodNotAllowedException';
  }
}
//406
export class NotAcceptableException extends HttpException {
  protected statusCode:number = 406;

  constructor(message:string = 'Not Acceptable'){
    super(message);
    this.name = 'NotAcceptableException';
  }
}
//407
export class ProxyAuthenticationRequiredException extends HttpException {
  protected statusCode:number = 407;

  constructor(message:string = 'Proxy Authentication Required'){
    super(message);
    this.name = 'ProxyAuthenticationRequiredException';
  }
}
//408
export class RequestTimeoutException extends HttpException {
  protected statusCode:number = 408;

  constructor(message:string = 'Request Timeout'){
    super(message);
    this.name = 'RequestTimeoutException';
  }
}
//409
export class ConflictException extends HttpException {
  protected statusCode:number = 409;

  constructor(message:string = 'Conflict'){
    super(message);
    this.name = 'ConflictException';
  }
}
//410
export class GoneException extends HttpException {
  protected statusCode:number = 410;

  constructor(message:string = 'Gone'){
    super(message);
    this.name = 'GoneException';
  }
}
//411
export class LengthRequiredException extends HttpException {
  protected statusCode:number = 411;

  constructor(message:string = 'Length Required'){
    super(message);
    this.name = 'LengthRequiredException';
  }
}
//412
export class PreconditionFailedException extends HttpException {
  protected statusCode:number = 412;

  constructor(message:string = 'Precondition Failed'){
    super(message);
    this.name = 'PreconditionFailedException';
  }
}
//413
export class PayloadTooLargeException extends HttpException {
  protected statusCode:number = 413;

  constructor(message:string = 'Payload Too Large'){
    super(message);
    this.name = 'PayloadTooLargeException';
  }
}
//414
export class URITooLongException extends HttpException {
  protected statusCode:number = 414;

  constructor(message:string = 'URI Too Long'){
    super(message);
    this.name = 'URITooLongException';
  }
}
//415
export class UnsupportedMediaTypeException extends HttpException {
  protected statusCode:number = 415;

  constructor(message:string = 'Unsupported Media Type'){
    super(message);
    this.name = 'UnsupportedMediaTypeException';
  }
}
//416
export class RangeNotSatisfiableException extends HttpException {
  protected statusCode:number = 416;

  constructor(message:string = 'Range Not Satisfiable'){
    super(message);
    this.name = 'RangeNotSatisfiableException';
  }
}
//417
export class ExpectationFailedException extends HttpException {
  protected statusCode:number = 417;

  constructor(message:string = 'Expectation Failed'){
    super(message);
    this.name = 'ExpectationFailedException';
  }
}
//422
export class UnprocessableEntityException extends HttpException {
  protected statusCode:number = 422;

  constructor(message:string = 'Unprocessable Entity'){
    super(message);
    this.name = 'UnprocessableEntityException';
  }
}
//429
export class TooManyRequestsException extends HttpException {
  protected statusCode:number = 429;

  constructor(message:string = 'Too Many Requests'){
    super(message);
    this.name = 'TooManyRequestsException';
  }
}
//451
export class UnavailableForLegalReasonsException extends HttpException {
  protected statusCode:number = 451;

  constructor(message:string = 'Unavailable For Legal Reasons'){
    super(message);
    this.name = 'UnavailableForLegalReasonsException';
  }
}
//500
export class InternalServerErrorException extends HttpException {
  protected statusCode:number = 500;

  constructor(message:string = 'Internal Server Error'){
    super(message);
    this.name = 'InternalServerErrorException';
  }
}
//501
export class NotImplementedException extends HttpException {
  protected statusCode:number = 501;

  constructor(message:string = 'Not Implemented'){
    super(message);
    this.name = 'NotImplementedException';
  }
}
//503
export class ServiceUnavailableException extends HttpException {
  protected statusCode:number = 503;

  constructor(message:string = 'Service Unavailable'){
    super(message);
    this.name = 'ServiceUnavailableException';
  }
}

export class InsufficientStorageException extends HttpException {
  protected statusCode:number = 507;

  constructor(message:string = 'Insufficient Storage'){
    super(message);
    this.name = 'InsufficientStorageException';
  }
}

