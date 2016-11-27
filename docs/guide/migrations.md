---
title: Migrations
description: Turn those models into tables, but don't break the production database while you do that
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
pendingTask: https://github.com/zerothstack/zeroth/issues/25
---

## Overview
Migrations are classes that represent a change in the database schema. They can either be a completely new table creation,
or changes to tables like column renaming, addition, deletion, moving of data from one table to another.

The important feature is that a migration should be reversible. This allows a mistake in a migration to be reversed safely
without breaking the app.

Sometime data loss is unavoidable, for example if you were to drop a column, the rollback can't recreate that lost data,
but if the migration is reversed, the column will be recreated as it was, just without data.

## Registration
Migrations can be registered using the `@Migration()` class decorator, and by extending the `AbstractMigration` abstract
class, which provides the common interface for `migrate()` and `rollback()`

Migrations classes must be imported by the server `main.ts` so that the decorator is invoked, registering the migration
with the `EntityRegistry`.

Example `./src/server/migrations/updateUsersUsername.migration.ts`:
```typescript
import { AbstractMigration, Database } from '@zerothstack/core/server';
import { Migration, Logger } from '@zerothstack/core/common';

@Migration()
export class UpdateUsersUsernameColumnMigration extends AbstractMigration {

  constructor(logger:Logger, database:Database){
    super(logger, database);
  }

  public migrate(): Promise<void> {
    return this.database.query(`ALTER TABLE users CHANGE username user VARCHAR(6) NOT NULL  DEFAULT ''`);
  }
  
  public rollback():Promise<void> {
    return this.database.query(`ALTER TABLE users CHANGE user username VARCHAR(6) NOT NULL  DEFAULT ''`);
  }

}
```

Example `./src/server/migrations/index.ts`:
```typescript
export * from './updateUsersUsername.migration';
```

Example `./src/server/main.ts`:
```typescript
import { bootstrap } from '@zerothstack/core/server';
import * as migrations from './migrations';

export { BootstrapResponse };
export default bootstrap([migrations], []);

```

## Current Status
Migrations are currently a work in progress. They are current run immediately, and in parallel on bootstrap, which is ok for localhost
rapid development, but won't work in production.

The plan is to have the migrations register then have the `RemoteCli` pick up which migrations need to be run, and when
the user logs in to the cli runtime they will be prompted for which migrations to run.

See the [github issue](https://github.com/zerothstack/zeroth/issues/25) for more info
