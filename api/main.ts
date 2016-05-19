// import * as Hapi from 'hapi';
// import {Request} from "hapi";
// import {IReply} from "hapi";
//
// import {Cat} from "../common/models/index";
//
// export const server = new Hapi.Server();
// server.connection({host: 'localhost', port: 3000});
//
// server.route({
//   method: 'GET',
//   path: '/',
//   handler: (request:Request, reply:IReply) => {
//
//     const greeting = new Cat().greet();
//
//     return reply(greeting);
//   }
// });
//
import 'es6-shim';
import 'reflect-metadata';
import {ReflectiveInjector, provide} from '@angular/core';

import {Server, HapiServer} from "./server";
import {TestController} from "./test";
let injector = ReflectiveInjector.resolveAndCreate([
  TestController,
  provide(Server, {useClass: HapiServer}),
]);

export const server:HapiServer = injector.get(Server);

injector.get(TestController);
