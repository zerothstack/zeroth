---
layout: home.hbs
title: Ubiquits
description: Full stack isomorphic typescript framework.
---

## Roadmap

### First [beta](https://en.wikipedia.org/wiki/Software_release_life_cycle#Beta) release (feature complete) [July 29]
- [ ] Angular Universal (server side prerendering) integration
- [ ] Docker deployment
- [ ] Email sending
- [ ] Queue handling
- [ ] Pagination service (front & backend)
- [ ] on initialization generate passwords and certificate for auth
- [ ] Integrate code generation methods from Angular CLI 
- [ ] Docker integration into toolchain for local dev
- [ ] CLI handled migrations & seeding
- [x] Database migrations
- [x] Database seeding from `MockModelProvider`s
- [x] Full validation decorator complement
- [x] 100% Code coverage
- [x] Migration to TypeORM
- [x] Entity registry with decorators for registering components anywhere

### Developer Preview [June 20th]
- [x] Model hydration and mocking
- [x] `ResourceController` implementation with CRUD routes
- [x] Custom middleware registration
- [x] Demo model schema sync and seed
- [x] Http exceptions
- [x] Post-initialization cli tour
- [x] Full stack demo in quickstart
- [x] FAQ page in docs
- [x] Documented contribution guidelines

### Sprint 0 [June 10th]
- [x] Full stack proof of concept
  - [x] Backend dependency injection with `@angular/core`
  - [x] Angular 2 compiling with webpack
  - [x] `webpack` watcher for browser & common changes with livereload
  - [x] `nodemon` watcher for server & common changes
  - [x] Compilation to es2015 for browser on build
  - [x] Compilation to es2015 for api on build
  - [x] Output consumable by `typings`
  - [x] Source mapping for api debugger
  - [x] Full stack debug breakpoints in Webstorm
  - [x] Live reloading browser
  - [x] Live restarting server
  - [x] Route registration with `@Route` decorator
  - [x] `docker-compose.json` running postgres db
  - [x] Connection to database from localhost with `Sequelize`
  - [x] Testing framework for both frontend and backend
  - [x] Travis Ci automated testing
  - [x] Coverage results remapped to typescript, pushed to coveralls
  - [x] Abstract and concrete `@injectable` implementation of `Logger` class/interface
  - [x] Automated deployment to npm registry with version bump
- [x] Commandline interface
  - [x] `vantage` cli task runner integrating with `gulp` and `metalsmith` tasks
  - [x] Configuration file in parent project
  - [x] Extendable commands
  - [x] Shell connection to server runtime context
  - [x] Runtime task registration
  - [x] Initialization of new projects (quickstart)
- [x] Documentation framework
  - [x] File watcher/livereload server
  - [x] Typedoc integration
  - [x] Extendable styles, templates, assets
  - [x] Default collections for automatic navigation generation
