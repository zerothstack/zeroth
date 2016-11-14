import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';


@Injectable()
class InjectService {

  constructor() {}

}

@Injectable()
class TestClass {

  constructor(public injected: InjectService) {}

}

xdescribe('Test service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
  });

  it('can be injected with the token', inject([TestClass], (c: TestClass) => {

    expect(c instanceof TestClass)
      .toBe(true);
    expect(c.injected instanceof InjectService)
      .toBe(true);

  }));
});

const providers = [
  TestClass,
  InjectService
];
