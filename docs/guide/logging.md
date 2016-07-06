---
title: Logging
description: Keep track of things that happen. If you don't, did they really happen?
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

Ubiquits provides an `@Injectable()` abstract service named `Logger`. This means that no matter what implementation you use,
 you can always inject the `Logger` service and the actual implementation will be determined by the service provider.
 

```typescript
import { Injectable } from '@angular/core';
import { Logger } from '@ubiquits/core/server';

@Injectable()
export class ExampleUtil {

  constructor(protected logger: Logger) {

    logger.info(`Hello World`);
  }

}

```

In the `./src/server/main.ts` file, the specific implementation is defined with
```typescript
let providers: ProviderDefinition[] = [
  {provide: Logger, useClass: ConsoleLogger},
];
```

For more information on registering and resolving dependencies, see [the provider registration guide][provider-registration]; 

## Methods

The logger provides methods for the eight logging levels defined in [RFC 5424](http://tools.ietf.org/html/rfc5424): 
emergency, alert, critical, error, warning, notice, info and debug.

```typescript
logger.debug(`Current request`, request);

logger.info(`User ${username} logged in`);

logger.notice(`User ${username} had 3 failed password attempts`);

logger.warning(`Response took ${responseTime}. This is far higher than normal`);

logger.error(`Query failed`, e.message);

logger.critical(`Redis connection failed`);

logger.alert(`S3 Bucket is ${percentage}% full`);

logger.emergency(`The server is on fire!`);
```

### Log Source
To define the source of a log, first chain on `.source('<source>')` to your log.
Depending on the implementation, this will have a different effect. With the `ConsoleLogger` implementation, this prefixes
`[<source>]` to the log line.

For example
```typescript
this.source('MyController').info(`Hello World`);
```
Will output

```
[12:05:21] [MyController] Hello World
```

## Implementations
As there are many different ways to log, there can be multiple implementations of the abstract `Logger` class.

### `ConsoleLogger`

This is the most basic, it logs straight to the console. You probably want to use this one in development.

Any non-string item passed as message is parsed by `util.inspect` which will nicely syntax highlight the object.

The different log levels are colour coded, to make it easy to differentiate the different log types.

### `MockLogger`
Use this implementation in your unit tests to avoid any unwanted output to the console. The mock logger simply provides
implementations for the abstract `Logger` class, and does nothing with the logs.

You can utilise the `MockLogger` in tests to assert logs by spying on the `persistLog` method.

For example:

```typescript
const loggerSpy = spyOn(exampleService.logger, 'persistLog');

exampleService.someMethodThatCallsLog();

expect(loggerSpy).toHaveBeenCalledWith('info', ['Hello world']);
```
Note that the `persistLog` method takes the log message arguments as an array

## Planned Implementations
* [Winston](https://github.com/winstonjs/winston)

[provider-registration]: http://localhost:8080/guide/application-lifecycle/#3-provider-registration
