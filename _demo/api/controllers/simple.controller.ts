import { Injectable } from '@angular/core';
import { Server } from '../../../api/servers/abstract.server';
import { AbstractController } from '../../../api/controllers/abstract.controller';
import { RouteBase } from '../../../api/controllers/routeBase.decorator';
import { Action } from '../../../api/controllers/action.decorator';
import { LoggerService } from '../../../api/services/logger.service';

@Injectable()
@RouteBase('simple')
export class SimpleController extends AbstractController {

  constructor(server: Server, logger: LoggerService) {
    super(server, logger);
  }

  @Action('GET', '/test/{id}')
  public test() {
    return 'hello world';
  }

}
