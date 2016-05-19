/// <reference path="../typings/index.d.ts" />
import * as Hapi from 'hapi';
import {Request} from "hapi";
import {IReply} from "hapi";

import {Cat} from "../common/models/index";


const server = new Hapi.Server();
server.connection({host:'localhost', port: 3000});

server.route({
  method: 'GET',
  path: '/',
  handler: (request:Request, reply:IReply) => {

    const greeting = new Cat().greet();
      
    return reply(greeting);
  }
});

server.start((err:any) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
