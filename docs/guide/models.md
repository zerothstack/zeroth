---
title: Models
description: Give your data some shape, then make it a family by encouraging relationships
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

Models are the key shared components of the Ubiquits framework. 
Typically, models represent a single row of a table, but this is by no means a limitation as a model can be any 
non-primitive data structure.

All models should extend `Model`, which provides a contract of methods so other services can interact
 with an entity in a common way.

In both the front and backend, models should be retrieved with a `<model>Store`. In the backend, this will typically
 interact with the database to retrieve data, but it could also be interacting with remote APIs or filesystems etc.
The key thing is that a controller that uses a `<model>Store` *does not care* what the source is, which allows the store to be
easily mocked for unit testing, or refactored to interact with a microservice rather than a database, for instance.

For more detail on `Store`s and the methods they provide, see the [Model Store guide page](/guide/model-stores).

## Hydration
Hydration is the process that turns a `new` and empty model into one that contains it's data. The execution of the `hydrate`
method should always be done *by* the `<model>Store`, however the actual assignment of that data into it's own data model
is the model's responsibility as the raw input should be the same no matter the `<model>Store` implementation.

In general, you should never have to override the `AbstractController.hydrate()` method, however it is good to know that
it is there as it can of course be overridden if you wish to modify its behavior.

In brief, the hydrator does the following actions:
1. Take a raw copy of the data for later comparison
1. Assign all properties of the input data to itself, replacing properties with getters & setters
1. Recursively hydrate any nested related models and associate as relations


## Data types
Data types are method decorators that define the typecasting from the raw data of a model. They are used by the hydrator
to get the data into the expected data types defined by the property types of the model.

For example in the following model, the birthday property is cast to a `Date` type with the `@castDate` decorator
```typescript
export class UserBirthday extends Model {

  @Primary()
  public userId: UUID;

  @castDate
  public birthday: Date;
}
```

## Relationships
This feature has not yet been implemented
## Validation
This feature has not yet been implemented

