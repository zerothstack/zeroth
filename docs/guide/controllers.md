---
title: Controllers
date: 2016-06-01
collection: guide
layout: guide.hbs
-----------------

### Example controller

```typescript
import { Injectable } from '@angular/core';
import {
  Server,
  RouteBase,
  AbstractController,
  Logger,
  Request,
  RouteParamMap,
  Action
} from '@ubiquits/core/server';
import { AbstractModel, ModelStore } from '@ubiquits/core/common';
import { User } from '../../common/models/user.model';
import { UserStore } from '../stores/user.store';


@Injectable()
@RouteBase('test')
export class TestController extends AbstractController {


  constructor(server: Server, logger: Logger, protected userStore:UserStore) {
    super(server, logger);

    logger.info(`route base is ${this.routeBase}`);

  }


  @Action('GET', '/test-route')
  public test() {
    return 'hello world';
  }

  protected getOneById(request: Request, routeParams: RouteParamMap): User {

    let user = this.userStore.findOne(routeParams.get('id'));
    this.logger.debug(user, user.getIdentifier());

    return user;

  }

}
```
