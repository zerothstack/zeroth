/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Injectable, Injector } from '@angular/core';
import { RemoteCli, ConnectedSocketCallback } from './remoteCli.service';
import { Logger } from '../../common/services/logger.service';
import { Service } from '../../common/registry/decorators';

import Spy = jasmine.Spy;

/**
 * Provides no-side effect mock for RemoteCli for use in testing fixtures
 */
@Injectable()
@Service()
export class RemoteCliMock extends RemoteCli {

  constructor(loggerBase: Logger, injector: Injector) {
    super(loggerBase, injector)
  }

  /**
   * Override of parent command register method
   * @returns {RemoteCliMock}
   */
  protected registerCommands(): this {
    return this;
  }

  /**
   * Override of parent start method
   * @param port
   * @param callback
   * @returns {RemoteCliMock}
   */
  public start(port: number, callback?: ConnectedSocketCallback): this {
    return this;
  }

  /**
   * This overrides the parent method so that vantage is not initialised in tests
   * @returns {RemoteCliMock}
   */
  public initialize(): this {
    return this.registerCommands();
  }

}
