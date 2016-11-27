---
title: Models
description: Give your data some shape, then make it a family by encouraging relationships
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

Models are the key shared components of the Zeroth framework. 
Typically, models represent a single row of a table, but this is by no means a limitation as a model can be any 
non-primitive data structure.

## Registration
Models must be decorated with `@Model()` and loaded by the server main.ts file to ensure that their properties are 
registered with the [ModelStore][model-store].

All models should extend `AbstractModel`, which provides a contract of methods so other services can interact
 with an entity in a common way.
 
Example `./src/common/models/example.model.ts`:
```typescript
import { Model, AbstractModel } from '@zerothstack/core/common';
import { AbstractController } from '@zerothstack/core/server';

@Model()
export class ExampleModel extends AbstractModel {...}

```

Example `./src/common/models/index.ts`:
```typescript
export { TestController } from './test.controller';
```

Example `./src/server/main.ts`:
```typescript
import { bootstrap } from '@zerothstack/core/server';
import * as models from '../common/models';

export { BootstrapResponse };
export default bootstrap([models], []);

```
In the backend, when the bootstrapper for models runs, it iterates through all the models assigning their property 
 definitions (defined by decorators) with the ORM. This is later used by the Migrations, Seeders and ModelStores to build
 the database schema and seed it with data. Also at runtime, thee definitions are used to determine mapping between the
 properties of the models and columns in the database.

## Manipulation
In both the front and backend, models should be retrieved with a `<model>Store`. In the backend, this will typically
 interact with the database to retrieve data, but it could also be interacting with remote APIs or filesystems etc.
The key thing is that a controller that uses a `<model>Store` *does not care* what the source is, which allows the store to be
easily mocked for unit testing, or refactored to interact with a microservice rather than a database, for instance.

For more detail on `Store`s and the methods they provide, see the [Model Store guide page][model-store].

## Relationships
*This feature has not yet been completed*

## See Also

* [Model Validation](/guide/validation)

[model-store]: /guide/model-stores
