import { Injectable } from '@angular/core';
import { Server } from '../../../api/servers/abstract.server';
import { AbstractController } from '../../../api/controllers/abstract.controller';
import { RouteBase } from '../../../api/controllers/routeBase.decorator';

@Injectable()
@RouteBase('test')
export class TestController extends AbstractController {

  constructor(server: Server) {
    super(server);
    
    console.log('route base is ', this.routeBase);
  }

}
