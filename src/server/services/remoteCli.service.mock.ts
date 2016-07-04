import { Injectable, Injector } from '@angular/core';
import { RemoteCli, ConnectedSocketCallback } from './remoteCli.service';
import { Logger } from '../../common/services/logger.service';

import Spy = jasmine.Spy;
import { Service } from '../../common/registry/decorators';

@Injectable()
@Service()
export class RemoteCliMock extends RemoteCli {

  constructor(loggerBase: Logger, injector: Injector) {
    super(loggerBase, injector)
  }

  protected registerCommands(): this {
    return this;
  }

  public start(port: number, callback?: ConnectedSocketCallback): this {
    return this;
  }

  /**
   * This overrides the parent method so that vantage is not initialised in tests
   * @returns {RemoteCliMock}
   */
  protected initializeVantage(): this {
    return this.registerCommands();
  }

}
