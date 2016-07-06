---
title: Dependency Injection
description: Inject those dependencies everywhere, frontend, backend, anywhere!
date: 2016-06-10
collection: guide
collectionSort: 1
layout: guide.hbs
---

Ubiquits uses Angular 2's dependency injector. As one of the primary goals of Ubiquits is to be able to share code between
the frontend and backend, it makes sense to use the same injector for both.

It is recommended to read the 
[Angular dependency injection guide](https://angular.io/docs/ts/latest/guide/dependency-injection.html), 
as nearly everything in there applies here, with the only exception being that there are no `@Component`s in the backend.
For the backend, the Ubiquits framework provides the following class decorators:
* `@Model`
* `@Controller`
* `@Seeder`
* `@Migration`
* `@Store`
* `@Service`

Remember that the fronted of a Ubiquits project *is Angular 2*, so it is important to have a firm grasp on how to work
with dependency injection anyway, and that knowledge transfers directly to the backend.


