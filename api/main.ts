import 'es6-shim';
import 'reflect-metadata';
import { ReflectiveInjector, provide } from '@angular/core';
import { Server, HapiServer } from './server';
import { TestController } from './test';
let injector = ReflectiveInjector.resolveAndCreate([
  TestController,
  provide(Server, {useClass: HapiServer}),
]);

export const server: HapiServer = injector.get(Server);

injector.get(TestController);
