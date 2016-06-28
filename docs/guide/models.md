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

## Relationships
This feature has not yet been implemented

## See Also

* [Model Validation](/guide/validation)
