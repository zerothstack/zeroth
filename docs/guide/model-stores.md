---
title: Model Stores
description: Use a common pattern for retrieving and saving models, no matter the platform 
date: 2016-06-10
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Overview
Model Stores are a way of providing a common interface for retrieval and saving of models.
There can be many types of store for the same model, depending on the service that the store is interacting with to do 
 that storage.
 
An example would be for the model `User`, the frontend would use the `UserHttpStore` to use the Angular `Http` service to
communicate via the REST API to get user models.

In the backend, the controller would use the `UserDatabaseStore` which communicates with the database to manage records.

The key point is that both `UserHttpStore` **and** `UserDatabaseStore` *implement* a common `UserStore` which defines
the interfaces that controllers should use to retrieve records.

This may seem rather complex, however bear in mind that you are managing both the frontend and backend interfaces simultaneously.
Ordinarily in a non-isomorphic stack, management of data storage would have completely separated logic, and often not even
be in the same language. By handling them at the same time, we can have common logic between them.

## Structure

See the diagram below to see where the stores sit in the directory structure and how their class relationships work
```
src
├── browser
│   ├── stores
│   │   └── user.http.store.ts    class UserHttpStore extends HttpStore<User> implements UserStore
├── common
│   ├── models
│   │   └── user.model.ts         class User extends Model
│   └── stores
│       ├── user.mock.store.ts    class UserMockStore extends MockStore<User> implements UserStore
│       └── user.store.ts         abstract class UserStore extends Store<User>{
└── server
    └── stores
        └── user.db.store.ts      class UserDatabaseStore extends DatabaseStore<User> implements UserStore
```


One important thing to note is that the stores *implement* the UserStore, but **they do not extend it**. This is because
the controllers that use the store `@Inject` the `UserStore` - the controller does not care about the specific implementation.

This allows you to easily swap where the data is being pulled from. An example could be that you initially had your users
stored in the database, then you migrated to using [Auth0][auth0]. As all your controllers and services were injecting
`UserStore` the only change you need to make is to change the provider in your bootstrap.

Before
```
let providers:ProviderDefinition[] = [
  provide(UserStore, {useClass: UserDatabaseStore}),
];
```
After
```
let providers:ProviderDefinition[] = [
  provide(UserStore, {useClass: UserAuth0Store}),
];

```

A common technique is to implement a `MockStore` first, then worry about the connections to the database or third party
 services later. That way you can focus on user/API interface before you lock in your data structures.

## Mock Stores
Mock stores are for retrieving mock models that are instances of your `Model`, but have mocked data provided. They are
useful for [unit testing][testing] and [seeders][seeding].

Mock stores must extend `MockStore<T extends AbstractModel>` so that they have the common methods of model retrieval.
The methods for persisting data are simply stubbed, as it doesn't make sense to save data to a mock store.

Example `./src/common/stores/user.mock.store.ts`:
```typescript
import { UserStore } from '../../common/stores/user.store';
import { User } from '../models/user.model';
import { identifier, MockStore } from '@zerothstack/core/common';
import { Injector, Injectable } from '@angular/core';

@Injectable()
export class UserMockStore extends MockStore<User> implements UserStore {

  constructor(injector:Injector) {
    super(User, injector);
  }
  
  protected getMock(id?:identifier):User {
    return new this.modelStatic({
      userId: id || this.chance().guid(),
      username: this.chance().first(),
      birthday: this.chance().date({
        year: this.chance().integer({min: 1900, max: 2000})
      })
    });
  }

}
```

All a mock store needs to do is implement the `getMock(id?:identifier):T` interface, so that the parent `MockStore` can
retrieve mock models.

Available to the class is the `this.chance()` method, which returns an instance of [ChanceJS] so you can have access to
a library of data mocking methods.

[auth0]: https://auth0.com/
[testing]: /guide/testing
[seeding]: /guide/seeding
[chancejs]: http://chancejs.com/
