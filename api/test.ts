import { Injectable } from '@angular/core';
import { Cat } from '../common/models/index';
import { Request, IReply, Response } from 'hapi';
import { Server } from './server';
import * as _ from 'lodash';

@Injectable()
export class TestController {

  constructor(private server: Server) {
    this.registerRoute();
  }

  private registerRoute(): void {

    this.server.register({
      method: 'GET',
      path: '/cat',
      handler: (request: Request, reply: IReply): Response => {

        const greeting = new Cat().greet();

        return reply(_.capitalize(greeting));
      }
    });

  }

}
