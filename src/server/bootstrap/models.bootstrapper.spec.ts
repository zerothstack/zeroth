import { it, beforeEachProviders, expect } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { RemoteCliMock } from '../services/remoteCli.service.spec';
import { RemoteCli } from '../services/remoteCli.service';
import { ServerMock } from '../servers/abstract.server.spec';
import { Logger } from '../../common/services/logger.service';
import { LoggerMock } from '../../common/services/logger.service.spec';
import { Server } from '../servers/abstract.server';
import { bootstrap, BootstrapResponse } from './index';
import { registry } from '../../common/registry/entityRegistry';
import { AbstractController } from '../controllers/abstract.controller';
import { Route } from '../controllers/route.decorator';
import { Request } from '../controllers/request';
import { Response } from '../controllers/response';
import { BaseModel } from '../../common/models/model';
import { Primary } from '../../common/models/types/primary.decorator';
import { StoredProperty } from '../../common/models/types/storedProperty.decorator';
import * as typeormColumns from 'typeorm/columns';
import Spy = jasmine.Spy;
import { CreatedDate, UpdatedDate } from '../../common/models/types/timestamp.decorator';

const providers: any[] = [
  {provide: Logger, useClass: LoggerMock},
  {provide: Server, useClass: ServerMock},
  {provide: RemoteCli, useClass: RemoteCliMock},
];

@Injectable()
class TestModel extends BaseModel {

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

  beforeEachProviders(() => providers);

  beforeEach(() => {
    registry.clearAll();

    registry.register('model', TestModel);

  });

  it('resolves and initializes model with Typeorm decorators', (done: Function) => {

    const result = bootstrap(null, providers)();

    const decoratorSpy = (lib:Object, decorator:string):{invoked:Spy, registered:Spy} => {
      const invoked = jasmine.createSpy(decorator);
      const registered = spyOn(lib, decorator).and.callFake(() => invoked);
      return {invoked, registered};
    };

    const primaryColumnSpy = decoratorSpy(typeormColumns, 'PrimaryColumn');
    const columnSpy = decoratorSpy(typeormColumns, 'Column');
    const createDateSpy = decoratorSpy(typeormColumns, 'CreateDateColumn');
    const updateDateSpy = decoratorSpy(typeormColumns, 'UpdateDateColumn');

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
