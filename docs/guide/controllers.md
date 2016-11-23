---
title: Controllers
description: Take requests and shove them where they need to go. Send the results somewhere
date: 2016-06-01
collection: guide
collectionSort: 1
layout: guide.hbs
---

Controllers in the Zeroth backend serve basically the same purpose as controllers in the frontend - they are the 
 interface between services and the view layer. The difference being that in the backend, the view laye is the JSON 
 serializer.

## Registration
Controller registration is handled with the `@Controller()` class decorator. To ensure that the controller is loaded at
bootstrap, the controllers are imported from the `./src/server/controllers/index.ts` [barrel] and passed into the bootstrap
method:

Example `./src/server/controller/test.controller.ts`:
```typescript
import { Controller } from '@zerothstack/core/common';
import { AbstractController } from '@zerothstack/core/server';

@Controller({
  routeBase: 'test',
})
export class TestController extends AbstractController {...}

```

Example `./src/server/controllers/index.ts`:
```typescript
export { TestController } from './test.controller';
```

Example `./src/server/main.ts`:
```typescript
import { bootstrap } from '@zerothstack/core/server';
import * as controllers from './controllers';

export { BootstrapResponse };
export default bootstrap([controllers], []);

```

## Decorator parameters
The `@Controller` decorator takes the following parameters to define the metadata on the controller:

### `routeBase`
This defines the starting route segment for all method routes to start with. 

Example `./src/server/controller/test.controller.ts`:
```typescript
import { Controller } from '@zerothstack/core/common';
import { AbstractController } from '@zerothstack/core/server';

@Controller({
  routeBase: 'test',
})
export class TestController extends AbstractController {...}

```
With the above controller, all routes will start with `/test`

For more info on routing see the [routing] guide

## REST Methods
As Zeroth is designed around the principles of good REST API patterns, the base `ResourceController` provides a number
of methods for interacting with the resource that controller provides.

### `getOne`
```typescript
   @Route('GET', '/:id')
   getOne(request: Request, routeParams: RouteParamMap):Response;
   ```

### `getMany`
```typescript
@Route('GET', '/')
getMany(request: Request, routeParams: RouteParamMap):Response;
```
### `putOne`
```typescript
@Route('PUT', '/:id')
putOne(request: Request, routeParams: RouteParamMap):Response;
```
### `putMany` *(planned)*
```typescript
@Route('PUT', '/')
putMany(request: Request, routeParams: RouteParamMap):Response;
```
### `deleteOne`
```typescript
@Route('DELETE', '/:id')
deleteOne(request: Request, routeParams: RouteParamMap):Response;
```
### `deleteMany` *(planned)*
```typescript
@Route('DELETE', '/')
deleteMany(request: Request, routeParams: RouteParamMap):Response;
```
### `patchOne`
```typescript
@Route('PATCH', '/:id')
patchOne(request: Request, routeParams: RouteParamMap):Response;
```
### `patchMany` *(planned)*
```typescript
@Route('PATCH', '/')
patchMany(request: Request, routeParams: RouteParamMap):Response;
```

You may note the absence of `POST` methods. This is intentional, as a well designed REST api that has distributed primary
key generation (UUIDs) should never require a method that generates the id server-side. This is a core tenet of an
[idempotent][http-idempotence] api - a request should be able to be replayed without there being a change in the state.

If you *really* need `POST` requests, your extension of the `ResourceController` can always implement it's own methods
 with a `@Route('POST', '/')` decorator, however this is strongly discouraged.
 


[barrel]: https://angular.io/docs/ts/latest/glossary.html#!#barrel
[routing]: /guide/routing
[http-idempotence]: https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Idempotent_methods_and_web_applications
