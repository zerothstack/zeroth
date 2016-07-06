---
title: Seeding
description: Fill your database with not-quite-junk data for rapid development
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Overview
Seeders are classes that define mock data to fill the database with for development and QA purposes.

When developing a new project locally, it can be quite a pain to set up your local database to have seed data that makes
sense to work with either when testing backend REST API's or developing user interfaces. Also, when a new teammember
 starts working on the project, they have to go through a painful process of replicating your database.
 
For QA testers, they need to go through the same process, and if some particularly curly bug occurs, it can sometimes
be difficult to work out if it was the starting conditions, or an actual bug.

When you add a new column, you are stuck with a choice of setting all rows to have the same value, or coming up with
some method to seed this missing data individually.

Seeders solve these issues by providing a repeatable, programmatic way of filling the database with realistic mock data,
which can be destroyed and re-run when the database schema changes, generating new mock data. 

## Registration
Seeders are registered using the `@Seeder()` class decorator, and should all extend the `AbstractSeeder` class.
This class provides the common interface that the `SeederBootstrapper` uses to start the seeder running.

Example `./src/server/seeders/example.seeder.ts`:
```typescript
import { UserStore } from '../../common/stores/user.store';
import { Logger, Collection, Seeder } from '@ubiquits/core/common';
import { AbstractSeeder } from '@ubiquits/core/server';
import { User } from '../../common/models/user.model';
import { UserMockStore } from '../../common/stores/user.mock.store';
import { UserDatabaseStore } from '../stores/user.db.store';

@Seeder()
export class ExampleSeeder extends AbstractSeeder {

  constructor(loggerBase: Logger, protected userStore: UserStore, protected userMockStore: UserMockStore) {
    super(loggerBase);
  }

  public seed(): Promise<void> {
    return this.userMockStore.findMany()
      .then((mockModels: Collection<User>) => {

        return (this.userStore as UserDatabaseStore).getRepository()
          .then((repo: any) => repo.persistMany(...mockModels));

      });
  }

}
```

Example `./src/server/seeders/index.ts`:
```typescript
export * from './example.seeder';
```

Example `./src/server/main.ts`:
```typescript
import { bootstrap } from '@ubiquits/core/server';
import * as seeders from './seeders';

export { BootstrapResponse };
export default bootstrap([seeders], []);

```


## Recommendations
The naive approach to seeders would be to create a seeder for each table. However this does not generate realistic 
database data - is there actually a way that a single isolated record can be created in every one of your tables? Probably
not.

Instead, the recommended approach is to think about seeders as user stories. Say you have an application where you sell
cars to a web user. Rather than creating a `CarSeeder`, `UserSeeder`, `CarFeatureSeeder`, `UserSelectionSeeder` etc, you
will get more realistic data if you create a `UserSignupSeeder`, `AdminCarEntrySeeder`, `UserCarPurchaseSeeder`.

Your goal when creating seeders should be to create as realistic data as is reasonable, so that when you are working with
it later on, you are dealing with a `Toyota Hilux` purchased by `Gary Peterson`, rather than `Foo car type` purchased
by `asdf1234`. Future you will thank current you ;)

For more information on `MockStores` for mocking the actual model data, see the [mock store documentation][mock-stores]


## Current status
Like [migrations], seeders are currently run on startup (immediately after migrations run). This is fine for local 
development, but is a slow process that you probably don't want running every time, even if you have a query check
if a table has been seeded.

In future, when migrations are moved into the runtime cli, seeders running will also be moved at the same time, and the
 cli will provide commands to run individual seeders.

[migrations]: /guide/migrations
[mock-stores]: /guide/model-stores/#mock-stores
