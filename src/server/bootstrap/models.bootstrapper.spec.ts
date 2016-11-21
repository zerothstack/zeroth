import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { RemoteCliMock } from '../services/remoteCli.service.mock';
import { RemoteCli } from '../services/remoteCli.service';
import { ServerMock } from '../servers/abstract.server.mock';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.mock';
import { Server } from '../servers/abstract.server';
import { bootstrap, BootstrapResponse } from './bootstrap';
import { EntityRegistry } from '../../common/registry/entityRegistry';
import { AbstractModel } from '../../common/models/model';
import { Primary } from '../../common/models/types/primary.decorator';
import { StoredProperty } from '../../common/models/types/storedProperty.decorator';
import * as typeorm from 'typeorm';
import { CreatedDate, UpdatedDate } from '../../common/models/types/timestamp.decorator';
import { AuthServiceMock } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';
import Spy = jasmine.Spy;

const providers: any[] = [
  {provide: Logger, useClass: LoggerMock},
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
  {provide: AuthService, useClass: AuthServiceMock},
];

@Injectable()
class TestModel extends AbstractModel {

  @Primary({type: 'integer'})
  public id: number;

  @StoredProperty({length: '10'})
  public name: string;

  @CreatedDate()
  public createdAt: Date;
  @UpdatedDate()
  public updatedAt: Date;

}

describe('Model Bootstrapper', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers });
    EntityRegistry.clearAll();

    EntityRegistry.register('model', TestModel);

  });

  it('resolves and initializes model with Typeorm decorators', (done: Function) => {

    const result = bootstrap(undefined, providers)();

    const decoratorSpy = (lib: Object, decorator: string): {invoked: Spy, registered: Spy} => {
      const invoked    = jasmine.createSpy(decorator);
      const registered = spyOn(lib, decorator)
        .and
        .callFake(() => invoked);
      return {invoked, registered};
    };

    const primaryColumnSpy = decoratorSpy(typeorm, 'PrimaryColumn');
    const columnSpy        = decoratorSpy(typeorm, 'Column');
    const createDateSpy    = decoratorSpy(typeorm, 'CreateDateColumn');
    const updateDateSpy    = decoratorSpy(typeorm, 'UpdateDateColumn');

    return result.then((res: BootstrapResponse) => {

      expect(primaryColumnSpy.registered)
        .toHaveBeenCalledWith({type: 'integer'});
      expect(primaryColumnSpy.invoked)
        .toHaveBeenCalledWith(TestModel.prototype, 'id');

      expect(columnSpy.registered)
        .toHaveBeenCalledWith({length: '10'});
      expect(columnSpy.invoked)
        .toHaveBeenCalledWith(TestModel.prototype, 'name');

      expect(createDateSpy.registered)
        .toHaveBeenCalled();
      expect(createDateSpy.invoked)
        .toHaveBeenCalledWith(TestModel.prototype, 'createdAt');
      expect(updateDateSpy.registered)
        .toHaveBeenCalled();
      expect(updateDateSpy.invoked)
        .toHaveBeenCalledWith(TestModel.prototype, 'updatedAt');

      done();

    });

  });

});
