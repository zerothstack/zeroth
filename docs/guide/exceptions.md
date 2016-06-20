---
title: Exceptions
description: Something gone terribly wrong? Thow an exception
date: 2016-06-20
collection: guide
collectionSort: 1
layout: guide.hbs
---

Ubiquits provides a number of built-in `HttpExceptions` that should be thrown rather than `Error` when an unexpected 
event occurs. This allows the call stack handler to inspect the exception status code, and return that to the client so
it can handle the error in a meaningful way.

The exceptions that are available are:

* BadRequestException (code 400)
* UnauthorizedException (code 401)
* PaymentRequiredException (code 402)
* ForbiddenException (code 403)
* NotFoundException (code 404)
* MethodNotAllowedException (code 405)
* NotAcceptableException (code 406)
* ProxyAuthenticationRequiredException (code 407)
* RequestTimeoutException (code 408)
* ConflictException (code 409)
* GoneException (code 410)
* LengthRequiredException (code 411)
* PreconditionFailedException (code 412)
* PayloadTooLargeException (code 413)
* URITooLongException (code 414)
* UnsupportedMediaTypeException (code 415)
* RangeNotSatisfiableException (code 416)
* ExpectationFailedException (code 417)
* UnprocessableEntityException (code 422)
* TooManyRequestsException (code 429)
* UnavailableForLegalReasonsException (code 451)
* InternalServerErrorException (code 500)
* NotImplementedException (code 501)
* ServiceUnavailableException (code 503)
* InsufficientStorageException (code 507)


## Example

In a database store, the NotFoundException is thrown when the record is not present in the database:

```typescript
public findOne(id: identifier): Promise<T> {
  return this.orm.findByPrimary(<number|string>id)
    .then((modelData: Instance<any>): T => {
      if (!modelData){
        throw new NotFoundException(`Model not found for id [${id}]`);
      }
      return new this.modelStatic(modelData.get());
    });
}
```

The exception is eventually caught by the stack handler, and will return the following response:

```
HTTP/1.1 404 Not Found
{
  "message": "Model not found for id [72eed629-c4ab-4520-a987-4ea26b134d8c]" 
}

```
