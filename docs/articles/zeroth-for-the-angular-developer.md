---
title: Zeroth for the Angular developer
description: An overview of the Zeroth framework from the perspective of an Angular developer
date: 2016-07-07
author: Zak Henry (https://twitter.com/zak)
collection: articles 
layout: post.hbs
----------------

*This article is part 1 of a 4 part series on ** Zeroth for the [Angular/NodeJS/PHP/.NET] developer **. Stay tuned for
the next in the series. New articles will be announced on the [twitter page][zeroth-twitter]*

---

If you're an [Angular] developer looking into backend framework options for a new personal or work project, and have come
up short on finding a JavaScript framework that is as powerful as Angular, look no further.

Zeroth is a full stack framework that uses Angular 2 in the frontend, and uses the same design patterns developed by
Angular to provide a backend framework. 

You may be immediately thinking that this is what [Angular Universal][universal],
does, however Universal is simply server-side prerendering of your frontend application, whereas Zeroth includes a fully 
fledged backend framework where you can interact with a Database, secure third party API's, and provide a REST API interface
for other API consumers like iOS or Android.

*It is actually planned to integrate Universal into the Zeroth framework; we're just waiting for the general release of
Angular so there is some stability.*

> tl;dr Zeroth is not Angular Universal, it is mostly a backend NodeJS framework designed to integrate with Angular 2

## Familiar look & feel
First and foremost, Zeroth is a [TypeScript] framework. Like Angular 2, there is *technically* no reason why you can't
use plain JavaScript, however because of the complexity of replicating the functionality of decorators and dependency 
injection, you really are better off sticking to TypeScript. Currently there are no plans to offer compiling from [Dart].

Zeroth uses the same dependency injector as Angular 2. Not just the same pattern, but the actual same code. This means
that everything you have learned about how to manage providers and `@Injectable()` classes from Angular applies to Zeroth.

Here is a basic backend controller, you can see the familiar `@Component()`-like pattern that is used.
```typescript
import { Injectable } from '@angular/core';
import { ResourceController } from '@zerothstack/core/server';
import { Logger, Controller } from '@zerothstack/core/common';
import { User } from '../../common/models/user.model';
import { UserStore } from '../../common/stores/user.store';

@Injectable()
@Controller({
  routeBase: 'users',
})
export class UserController extends ResourceController<User> {

  constructor(logger: Logger, userStore: UserStore) {
    super(logger, userStore);
  }

}
```

And here is a typical `main.ts` file from the server side of a Zeroth appliation. Apart from the obviously backend 
terminology, it should look rather familiar to an Angular 2 developer.

```typescript
import {
    bootstrap,
    deferredLog,
    BootstrapResponse
} from '@zerothstack/core/server';
import { Logger, ConsoleLogger } from '@zerothstack/core/common';
import { UserStore } from '../common/stores/user.store';
import { UserMockStore } from '../common/stores/user.mock.store';
import { Injector } from '@angular/core';

import * as seeders from './seeders';
import * as models from '../common/models';
import * as controllers from './controllers';
import * as migrations from './migrations';
import * as services from './services';

let providers = [
  {provide: UserStore, useClass: UserMockStore},
  {provide: Logger, useClass: ConsoleLogger},
];

export default bootstrap([
    models, controllers, seeders, migrations, services
], providers);
export { BootstrapResponse };
```

## Isomorphic models/services/utilities
This one of the major feature of the Zeroth framework, and while *isomorphic* is admittedly quite a buzzword these days,
it is used to describe a clever trick that you can do with a framework that uses the same language in the fronted and backend.

With the Zeroth framework, you can develop a utility that is completely platform independent, and utilize it in the 
frontend and backend, without any modification. This is particularly useful for describing data objects like Models where
it makes sense to have the exact same implementation both in your frontend user interface, and backend interactions with 
the database and other services.

Say you have a situation where the backend team changes a column type in the database, which means there needs
to be a change to the backend model, which means a change to the REST API interface, which means a change to the Angular
frontend model, and potentially some changes to the user interface. 
That is a lot of changes, and if any of the steps is missed, you probably have a bug on your hands. 

With Zeroth there is one common model, and it's datatypes are defined in the the same class, which is used by the 
frontend and backend services, and also informs the database schema.

## Integrated Tooling
In addition to the core framework Zeroth [provides a cli][cli] which allows you to develop locally and have live reload of your
 application as you write it. Complilation is handled with [Webpack] and the Zeroth cli has a custom dev server to handle
 the live reloading. Custom functionality can be easily added to the cli if you have special compile requirements, for example
 a custom deployment process.
 
## Strong documentation
Any good application needs to be well documented, for the sanity of your future self and anyone who works on your project

### API docs
Part of the build pipeline provided by the CLI includes a utility to generate API documentation directly from your typescript files.
This works both for the frontend Angular files, and all backend and common files. You can see this in action at the [core
Zeroth API documentation][api]. The documentation is generated using [Typedoc].

### Documentation site
The cli also is capable of generating a documentation site (http://zeroth.io is generated using the cli). 
This allows you to create pages using just markdown syntax, with code samples to explain how something works in your app.

## Summary
If you've fallen in love with the TypeScript language and are frustrated by the current offerings for TypeScript frameworks
in the backend world, have look around the Zeroth documentation and see if it is the right fit for you.

### Get stuck in!
If you're keen to give Zeroth a go, head on over to the [quickstart guide][quickstart] and jump in. 

*Bear in mind that Zeroth is current in alpha (developer preview), so there will be relatively frequent changes to the 
API as we head towards beta (Planned for late August 2016).*

[angular]: https://angular.io
[zeroth-twitter]: https://twitter.com/zeroth
[universal]: https://universal.angular.io/
[typescript]: http://www.typescriptlang.org/
[dart]: https://www.dartlang.org/
[webpack]: https://webpack.github.io/
[cli]: /guide/cli
[api]: /api
[typedoc]: http://typedoc.io/
[quickstart]: /guide/quick-start
