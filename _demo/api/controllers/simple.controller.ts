import { Injectable } from '@angular/core';
import { Server } from '../../../api/servers/abstract.server';
import { AbstractController } from '../../../api/controllers/abstract.controller';
import { RouteBase } from '../../../api/controllers/routeBase.decorator';
import { Action } from '../../../api/controllers/action.decorator';

@Injectable()
@RouteBase('simple')
export class SimpleController extends AbstractController {

  constructor(server: Server) {
    super(server);
  }

  @Action('GET', '/test/{id}')
  public test() {
    return 'hello world';
  }

}
