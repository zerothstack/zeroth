import {Injectable} from '@angular/core';
import {Cat} from "../common/models/index";
import {Request} from "hapi";
import {IReply} from "hapi";
import {Server} from "./server";
import * as _ from "lodash";

@Injectable()
export class TestController {

  constructor(private Server:Server) {
    this.registerRoute();
  }

  private registerRoute():void {

    this.Server.register({
      method: 'GET',
      path: '/cat',
      handler: (request:Request, reply:IReply) => {

        const greeting = new Cat().greet();

        return reply(_.capitalize(greeting));
      }
    });

  }

}
