import 'reflect-metadata';
import {platformServerTesting, ServerTestingModule} from '@angular/platform-server/testing';
import { TestBed } from '@angular/core/testing';

TestBed.initTestEnvironment(ServerTestingModule, platformServerTesting());
console.log('initialised test env');
