---
title: Database
description: Poke your database in the ribs, carefully though - direct interaction is scary!
date: 2016-06-01
collection: guide
collectionSort: 1
layout: guide.hbs
-----------------

## Intro
Ubiquits makes connecting to and querying databases very simple. The connection configuration is all managed in the 
`.env` file. When working locally it is recommended to use Docker with Docker Compose to allow extremely simple startup
and shutdown.

Working with docker locally [will be simplified greatly][docker-issue] soon, but in the meantime it is simply a case of 
getting Docker running locally with Docker for [Mac][dfm]/[Windows][dfw]/[Linux][dfl] then running `docker-compose up -d`

Working locally shouldn't have to be a chore to get a database stood up with the table structure and relevant dummy data
entered. Instead, the Ubiquits frameworks provides [migration] and [seeder] capabilities to manage building both your
 localhost database, and manage live database schema changes.

## Queries
### Model Stores & ORM
Generally, controllers shouldn't interact directly with the `Database` dependency. Instead, they should interact with
 a [`ModelStore`][model-store] which extends the `DatabaseStore<Model>`. Classes that extend `DatabaseStore` have access
 to the TypeORM repository for the current model context, which allows powerful querying and manipulation of models.

### Raw Queries
If you **really** need to make a direct database query, the `Database` service has a `getDriver()` method to directly
interact with the database. This can be useful for more complex operations like doing batch operations that are managed 
within a transaction.

### Prepared Statements
Prepared statements give SQL injection protection by signalling which parts of a query are variables and should be protected
against. This execution is actually passed through to the native database driver - it is not handled in javascript at all.

To prepare a statement, simply [tag an es6 template string][tagged-templates] with `Database.prepare`:
```typescript
return this.database.query(Database.prepare`INSERT
  INTO books
  (name, author, isbn, category, recommended_age, pages, price)
  VALUES  (${name}, ${author}, ${isbn}, ${category}, ${recommendedAge}, ${pages}, ${price})
`);
```
Take care to note that the `Database.prepare` tag does not wrap the string in parenthesis like a function call - it is 
```typescript
Database.prepare`template string ${templateVariable}`
```
Prepared statement string processing is provided by the [sql-template-strings] library

### Example complex database query
This is an obviously contrived example but it demonstrates the use of transactions and prepared statements.
```typescript
import { Injectable } from '@angular/core';
import { Database } from '@ubiquits/core/server';
import { Logger } from '@ubiquits/core/common';

class ExampleUtil {

  constructor(protected database: Database, protected logger: Logger) {
  }

  public flagLongUsernames(role: string, length: number): Promise<void> {

    let driver: Driver;
    return this.database.getDriver()
      .then((d: Driver) => {
        driver = d;
        return driver.beginTransaction();
      })
      .then(() => this.database.query(Database.prepare`UPDATE users SET flagged = LENGTH(username) > ${length} WHERE role = ${role}`))
      .then(() => driver.commitTransaction())
      .catch(() => driver.rollbackTransaction());

  }

}
```

## NoSQL support
Ubiquits is designed primarily to interact with a relational database. Support for NoSQL options like MongoDB are planned
 for the future, but not an immediate priority.

[migration]: /guide/migrations
[seeder]: /guide/seeders
[docker-issue]: https://github.com/ubiquits/toolchain/issues/13
[dfm]: https://docs.docker.com/docker-for-mac/
[dfw]: https://docs.docker.com/docker-for-windows/
[dfl]: https://docs.docker.com/engine/installation/linux/
[model-store]: /guide/model-stores/
[tagged-templates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[sql-template-strings]: https://www.npmjs.com/package/sql-template-strings
