---
title: Database
description: Poke your database in the ribs, carefully though - direct interaction is scary!
date: 2016-06-01
collection: guide
collectionSort: 1
layout: guide.hbs
pendingTask: true
-----------------

## Intro

## Queries
### ORM
### Raw

### Example database query

```typescript
import { Injectable } from '@angular/core';
import { Database } from '@ubiquits/core/server';

@Injectable()
export class ExampleUtil {

    constructor(database: Database, logger: Logger) {

        database.query('SELECT * FROM users').then((result) => {
            logger.debug(result);
        });

    }

}
```
