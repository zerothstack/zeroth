import { Injectable } from '@angular/core';
import { Server } from '../../../api/servers/abstract.server';
import {
  AbstractController, Request,
  RouteParam
} from '../../../api/controllers/abstract.controller';
import { RouteBase } from '../../../api/controllers/routeBase.decorator';
import { Action } from '../../../api/controllers/action.decorator';
import { LoggerService } from '../../../api/services/logger.service';
import { AbstractModel } from '../../../common/models/abstract.model';
import { Cat } from '../../common/models/cat.model';

@Injectable()
@RouteBase('simple')
export class SimpleController extends AbstractController {

  constructor(server: Server, logger: LoggerService) {
    super(server, logger);
  }

  @Action('GET', '/test-route')
  public test() {
    return 'hello world';
  }

  protected getOneById(request: Request, routeParams: RouteParam[]): AbstractModel {
    return new Cat();
  }

}
