---
title: Middleware
description: Squeeze custom logic into the request-response cycle
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

Middleware are blocks of code that are executed before or after the main controller method is run. They take the
same arguments and return type as a controller route method, and are applied in order with each middleware
passing it's `Response` to the next in the stack.

The implementation is such that there is actually no difference between a middleware and a controller method - they all are
items in the call stack, the only difference being that the controller method is executed in the context of the controller
 and so has access to all services injected by that controller.

## Usage
Middleware are applied with the method decorators `@Before(...middlewareFactories)` and `@After(...middlewareFactories)`.

### Order
Middleware is applied in left to right order of the decorator params.
For example:
```typescript
  @Action('GET', '/example')
  @Before(debugLog('Middleware ran 1'), debugLog('Middleware ran 2'))
  @After(debugLog('Middleware ran 3'))
  public exampleMethod(request: Request, response: Response): Response {
    this.logger.info('Method ran');
    return response.data('banana');
  }
```
A `GET` request for the route will result in the following log
```
[server] [17:39:33]  [Log middleware] Middleware ran 1
[server] [17:39:33]  [Log middleware] Middleware ran 2
[server] [17:39:33]  [controller] Method ran
[server] [17:39:33]  [Log middleware] Middleware ran 3
```

## Registration
There are two types of middleware - isolated functions and injectable classes. Their usage is the same, but their registration differs. 
The isolated functions are the simplest type; they just take a `Request` and `Response` object and return a `Response` or `Promise<Response>`.

Injectable class middleware are significantly more complex, but they gain the advantage of being able to use injected dependencies
and be substituted with other implementations with the dependency injector.

### Isolated function Middleware
If a middleware has simple requirements like basic request or response manipulation, a simple middlware factory is sufficient.

Here is an example of a basic middleware that defines a header to copy from the request to the response:
```typescript
function forwardHeader(headerName: string): IsolatedMiddlewareFactory {
  //use a named function here so the call stack can easily be debugged to show the called middleware
  return () => function forwardHeader(request: Request, response: Response): Response {
    response.header(headerName, request.headers().get(headerName));
    return response;
  }
}
```

### `@Injectable` class Middleware
For more advanced Middleware that need to interact with other services a more complex pattern is available to use classes
that have injectable dependencies.

Here is an example of a middleware that is defined by a class that is `@Injectable()`
```typescript

export function authorize(claim:string): InjectableMiddlewareFactory {

  return (injector: ReflectiveInjector): Middleware =>
    injector.get(AuthorizationMiddleware).middlewareFactory();
  
}

@Injectable()
export class AuthorizationMiddleware implements InjectableMiddleware {

  constructor(protected auth: Authorizor) {
  }

  public middlewareFactory(claim:string): Middleware {

    //use a named function here so the call stack can easily be debugged to show the called middleware
    return function authorize(request: Request, response: Response): Response {
      if (!this.auth.check(request, claim)) {
        throw new UnauthorizedException('Forbidden');
      }
      return response;
    }.bind(this);
  }
}

```
Note that the `authorize` function returns a closure that takes a `ReflectiveInjector` param. The injector is passed
in when the middleware is registered from the route. This is handled within the `registerRoutes()` method of the `AbstractController`.

In future there may be a cleaner way of registering functions within decorators by retrieving the `injector` outside of class instances. 
This is a [recognised issue](https://github.com/angular/angular/issues/4112) in the angular core, so once that is resolved this API may simplify.

