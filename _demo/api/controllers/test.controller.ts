import { Injectable } from '@angular/core';
import { Server } from '../../../api/servers/abstract.server';
import { AbstractController } from '../../../api/controllers/abstract.controller';
import { RouteBase } from '../../../api/controllers/routeBase.decorator';
import { LoggerService } from '../../../api/services/logger.service';

@Injectable()
@RouteBase('test')
export class TestController extends AbstractController {

  constructor(server: Server, logger: LoggerService) {
    super(server, logger);

    logger.info('route base is %s', this.routeBase);

  }

}
