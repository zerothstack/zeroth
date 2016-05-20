import {
  it, xit,
  inject,
  describe,
  beforeEachProviders,
  expect
} from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App', () => {
  beforeEachProviders(() => [
    AppComponent
  ]);
  it('should work', inject([AppComponent], (app: AppComponent) => {
    // Add real test here
    expect(2).toBe(2);
  }));

  xit('should skip', () => {
    expect(true).toBe(false);
  });
});
