---
title: Controllers
description: Take requests and shove them where they need to go. Send the results somewhere
date: 2016-06-01
collection: guide
collectionSort: 1
layout: guide.hbs
---

Controllers in the Ubiquits backend serve basically the same purpose as controllers in the frontend - they are the 
 interface between services and the view layer. The difference being that in the backend, the view layer
 is the JSON serializer.

## Registration
Unlike services which are instantiated on demand when injected somewhere, all controllers are instantiated at boot time.
This is so the controllers can register their routes with the `Server` instance before the server has started.

Registration occurs in the `./src/server/main.ts` file:

```typescript
import { 
  ReflectiveInjector, 
  ResolvedReflectiveProvider, 
  provide 
} from '@angular/core';
import * as controllerMap from './controllers';

[...]

// resolve all controllers
const controllers = Object.keys(controllerMap).map(key => controllerMap[key]);
const resolvedControllerProviders = ReflectiveInjector.resolve(controllers);

[...]

// iterate over the controller providers
resolvedControllerProviders
  .forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
    // instantiate provider to register routes
    injector.instantiateResolved(resolvedControllerProvider);
  });
```

As you can see above, the controllers are picked up by reading the controllers out of the `./src/server/controllers/index.ts`
 [barrel](https://angular.io/docs/ts/latest/glossary.html#!#barrel), which simply exports the controllers that you have created.
 
Example `./src/server/controllers/index.ts`:
```typescript
export {TestController} from './test.controller';
```

## REST Methods
As Ubiquits is designed around the principles of good REST API patterns, the base `AbstractController` provides a number
of methods for interacting with the resource that controller provides.

### `getOne`
```typescript
   @Route('GET', '/:id')
   getOne(request: Request, routeParams: RouteParamMap):Response;
   ```

### `getMany` (planned)
```typescript
@Route('GET', '/')
getMany(request: Request, routeParams: RouteParamMap):Response;
```
### `postOne` (planned)
```typescript
@Route('POST', '/')
postOne(request: Request, routeParams: RouteParamMap):Response;
```
### `postMany` (planned)
```typescript
@Route('POST', '/')
postMany(request: Request, routeParams: RouteParamMap):Response;
```
### `putOne` (planned)
```typescript
@Route('PUT', '/:id')
putOne(request: Request, routeParams: RouteParamMap):Response;
```
### `putMany` (planned)
```typescript
@Route('PUT', '/')
putMany(request: Request, routeParams: RouteParamMap):Response;
```
### `deleteOne` (planned)
```typescript
@Route('DELETE', '/:id')
deleteOne(request: Request, routeParams: RouteParamMap):Response;
```
### `deleteMany` (planned)
```typescript
@Route('DELETE', '/')
deleteMany(request: Request, routeParams: RouteParamMap):Response;
```

