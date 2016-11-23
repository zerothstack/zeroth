---
title: Application Lifecycle
description: What happens when everything starts happening
date: 2016-06-30
collection: guide
collectionSort: 1
layout: guide.hbs
---

This guide outlines the lifecycle of the backend side of a Zeroth application, as the frontend lifecycle is just standard
Angular 2. 

## Startup
Like the frontend, bootstrapping the application happens both in the `main.ts` section of the project, and in the core
module. The core handles the loading, registration and bootstrapping of both core components and the components that 
are defined in the application.

To kick off the server, the entry javascript file will require the exported `bootstrap()` function. In production, this
 file would be the `./lib/server/server/bootstrap.js` file. In development, this bootstrapping is handle by the cli,
 as it extends the capabilities of the before start to allow the webpack dev sever to run and the file watchers to start
 detecting changes.
 
### 1. Configuration
When first loaded, the `dotenv` library looks for a `.env` file in the current working directory, and exports all variables
 to `process.env`. For more info, see the [Configuration Section](/guide/configuration) of the guide

### 2. Entity Registration
Next, all of the entities of the application are loaded. In your `main.ts` file, this will look something like
```typescript
import * as models from '../common/models';
import * as controllers from './controllers';
import * as migrations from './migrations';

let loadClasses = [
  models, controllers, seeders, migrations
];
```

While this just looks like a naive retrieval of entities to load, what is actually happening is more complex as each of
those entities have class decorators, which cause registration of the classes to the central `EntityRegistry`. In addition,
any method or property decorators register their metadata against the static class (Remember the class has no instances
 yet; it is simply a class definition).

### 3. Provider Registration
Next, all providers are defined. This is akin to the provider definition in the frontend, and actually has the same interface
 with the one exception that the providers can be promises.

In the apps `main.ts`, this would appear as follows:
```typescript
let providers: ProviderDefinition[] = [
  Injector,
  {provide: UserStore, useClass: UserDatabaseStore},
  {provide: Logger, useClass: ConsoleLogger},
];

```
Sometimes it can be unclear what should be registered in the provider definitions and what should be in the `loadClasses`
array. A general rule of thumb is that if a class uses an entity decorator like `@Model`, `@Controller` etc, then it only
needs to be imported into the `loadClasses` array. All of the entity decorators are bootstrapped and registered with the
injector separately, so they do not need to be in the providers array. You would only want to explicitly provide a decorated
entity if you are substituting an implementation, or have some funky factory requirements.
 
### 4. Bootstrap
The bootstrapping is in itself a multi-phase process. The core exports a `bootstrap` function, which is invoked with the
entities and providers defined above.
1. The bootstrapping is deferred until all provider promises have resolved. If *any* are rejected, bootstrapping is aborted.
1. Specialist bootstrappers for each Entity type (models, migrations, seeders, controllers) retrieve the injectable instances 
from the core registry and when appropriate, resolve them with the `ReflectiveInjector`
1. A new `injector` instance is created using the passed providers and newly resolved entities
1. Any logs that have been buffered up to this point are output with the newly resolved concrete `Logger` implementation
1. The specialist bootstrappers are invoked one-by-one to prepare or run the entities. The order is:
 1. **Models** - Their property definitions are registered with the ORM
 1. **Service** - Their `initialize` methods are called and further bootstrapping is deferred until all promises resolve
 1. **Migrations** - Migrations are run
 1. **Seeders** - Seeders are run
 1. **Controllers** - controller routes & methods are registered with the underlying `Server` instance
1. Any passed `afterBootstrap` function is invoked.
1. Finally, when all bootstrappers are finished, the underlying `Server`, `Logger` and `Injector` instances are returned
 to the invoking bootstrap file

### 5. Server start
The final step - with the bootstrap completed and an instance of `Server` in hand, all that needs to happen is start the
 server running. In the `bootstrap.ts` file this looks like the following:
```typescript
import 'reflect-metadata';
import bootstrap from './main';

export default bootstrap().then(({server, logger}) => {
  return server.start().then(() => {
    logger.source('server').info('Server running at:', server.getHost());
  });

});

```
Once that `start` promise is resolved, the server can start taking http connections.

## Runtime
### HTTP
When there is an incoming http connection, the following process occurs:
1. The `Server` instance matches the URL to get the appropriate controller method to invoke
1. A new request and response are created
1. The request and response are passed into the matched call stack, which includes all middleware and the actual controller method
1. The call stack is invoked in order, with any rejected promises or thrown Errors causing the stack to abort and handling
to defer to the error handler.
1. On successful resolution of the call stack, the response is dispatched to the `Server` to handle sending back to the client.

### Remote Sessions
All Zeroth applications have remote connection capabilities provided by the `RemoteCli` service. When a connection is
established using the [CLI](/guide/cli), depending on the task that is executed, define commands can interact with the
running server.

### Queues/Cron
Queues and Cron have not yet been implemented.
