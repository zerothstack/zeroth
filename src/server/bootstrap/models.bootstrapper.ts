/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { ModelStatic } from '../../common/models/model';
import { Table } from 'typeorm/tables';
import { PrimaryColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm/columns';
import { ModelMetadata } from '../../common/metadata/metadata';

/**
 * Provides bootstrapping of the @[[Model]] entities
 */
export class ModelBootstrapper extends EntityBootstrapper {

  /**
   * Models are not injectable, so this method simply returns an empty array
   * @returns {Array}
   */
  public getInjectableEntities(): any[] {
    return [];
  }

  /**
   * Bootstraps the models. Each model has it's metadata mapped to the decorators from TypeORM
   * which are invoked to register their metadata with the internal TypeORM. This registry is later
   * used by the ModelStores which manipulate the TypeORM repository
   */
  public bootstrap(): void {
    this.getFromRegistry('model')
      .forEach((model: ModelStatic<any>) => {
        const meta: ModelMetadata = model.getMetadata();

        this.logger.info(`initializing ${model.name}`, meta);

        Table(meta.storageKey, meta.tableOptions)(model);

        for (const [property, definition] of meta.storedProperties) {
          if (property === meta.identifierKey) {
            PrimaryColumn(definition.columnOptions)(model.prototype, property);
          } else {
            Column(definition.columnOptions)(model.prototype, property);
          }
        }

        if (meta.timestamps) {

          if (meta.timestamps.updated) {
            UpdateDateColumn()(model.prototype, meta.timestamps.updated);
          }

          if (meta.timestamps.created) {
            CreateDateColumn()(model.prototype, meta.timestamps.created);
          }

        }

      });
  }

}
