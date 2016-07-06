---
title: Services
description: Interact with other things and stuff
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Intro
Services are general-purpose singleton classes that can be injected by Controllers, Middleware, other services etc.
A service can do anything from interacting with a third party API, to manipulating the local filesystem, to handling
complex calculations.

It reasonable to say that a service is anything that doesn't fit into the more rigid definitions of the other entities. 

## Registration
### Basic
If a service has no special startup requirements, it can simply be decorated with `@Injector()`, then be injected somewhere.
 
Example:
`./src/common/services/example.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { Logger } from '@ubiquits/core/common';

@Injectable()
export class ExampleService {

  protected logger: Logger;

  constructor(loggerBase: Logger) {
    this.logger = loggerBase.source('Example Service');
  }

  public logTest(message: string): void {
    this.logger.debug(message);
  }

}
```
This service can be injected into any Controller by simply typehinting the service name:

```typescript
constructor(protected exampleService: ExampleService) {}
```
The class will have a singleton instance of the `ExampleService` ready for action at `this.exampleService`

### Bootstrap blocking
For more specialist services, the `@Service()` decorator is available which registers the service with the `EntityRegistry`,
and is specially handled in the bootstrapper to defer bootstrapping of any other entity types until the `Service.initialize()`
 promise is resolved.

These services should both be decorated with `@Service` *and* extend `AbstractService`, which provides the interface for
the `initialized()` method.

An (extremely contrived) example:
```typescript
import { Injectable } from '@angular/core';
import { Logger, Service, AbstractService } from '@ubiquits/core/common';
import { lookup } from 'dns';

@Injectable()
@Service()
export class DnsService extends AbstractService {

  protected logger: Logger;

  constructor(loggerBase: Logger) {
    super();
    this.logger = loggerBase.source('DNS Service');
  }

  public lookup(host: string): Promise<string> {
    return new Promise((resolve, reject) => {
      lookup(host, (err, address) => {
        if (err) {
          return reject(err);
        }
        return resolve(address);
      })
    });
  }

  public initialize(): Promise<this> | this {
    return this.lookup('google.com')
      .then((address) => {
        this.logger.info(`Lookup passed, found address ${address}`);
        return this;
      })
      .catch((e) => {
        this.logger.error(`Failed DNS lookup for Google, aborting bootstrap as either there is no internet connection or the world has ended`);
        throw e;
      });
  }

}
```

In general, you shouldn't need services that abort bootstrapping, but sometimes it is useful, especially if it is a service
that you know it's failure will mean unexpected results if the server were to boot successfully.

This bootstrap blocking is specific to the backend, and while services can be defined in the frontend or common sections,
it has no effect on the frontend bootstrapper.
