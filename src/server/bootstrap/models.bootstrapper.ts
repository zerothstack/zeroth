import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { ModelStatic } from '../../common/models/model';
import {Table} from 'typeorm/tables';
import { PrimaryColumn, Column } from 'typeorm/columns';
import { ModelMetadata } from '../../common/metadata/metadata';

export class ModelBootstrapper extends EntityBootstrapper {

  public getResolvedEntities(): ResolvedReflectiveProvider[] {
    return [];
  }

  public bootstrap(): void {
    this.getFromRegistry('model').forEach((model: ModelStatic<any>) => {
      const meta:ModelMetadata = model.getMetadata();

      this.logger.info(`initializing ${model.name}`, meta);

      Table(meta.storageKey, meta.tableOptions)(model);
      PrimaryColumn()(model.prototype, meta.identifierKey);

      for(const [property, type] of meta.storedProperties){
        Column()(model.prototype, property)
      }

      //@todo assign table/columns etc

    });
  }

}