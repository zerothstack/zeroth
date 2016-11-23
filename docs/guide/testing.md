---
title: Testing
description: Make sure your beautiful code doesn't bite you later
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Unit Testing
### Overview

Unit testing in Zeroth follows the exact same pattern as Angular 2. As such, it uses the [Jasmine] BDD framework, with
extra methods for dependency injection and handling of providers.

### Example with dependency injection

```typescript
import { Logger, LoggerMock } from '@zerothstack/core/common';
import { addProviders, inject, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import Spy = jasmine.Spy;

@Injectable()
class ExampleService {

  constructor(protected logger: Logger) {}

  public testLog(message: string): this {
    this.logger.debug(message);
    return this;
  }

  public testLogAsync(message: string): Promise<this> {
    return Promise.resolve()
      .then(() => {
        this.testLog(message);
        return this;
      });
  }

}

const providers = [
  {provide: Logger, useClass: LoggerMock},
  ExampleService
];

describe('Example service', () => {

  beforeEach(() => {
    addProviders(providers);
  });

  it('logs messages passed to it',
    inject([ExampleService, Logger], 
    (service: ExampleService, logger: Logger) => {

      const loggerSpy: Spy = spyOn(logger, 'persistLog');

      service.testLog('hello world');

      expect(loggerSpy).toHaveBeenCalledWith('debug', ['hello world']);
    }));

  it('logs messages passed to it after promise is resolved',
    async(inject([ExampleService, Logger], 
    (service: ExampleService, logger: Logger) => {

      const loggerSpy: Spy = spyOn(logger, 'persistLog');

      expect(loggerSpy).not.toHaveBeenCalledWith('debug', ['hello world async']);

      return service.testLogAsync('hello world async')
        .then(() => {
          expect(loggerSpy).toHaveBeenCalledWith('debug', ['hello world async']);
        });

    })));

});
```


[jasmine]: http://jasmine.github.io/2.4/introduction.html
