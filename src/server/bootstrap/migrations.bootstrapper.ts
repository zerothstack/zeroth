/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractMigration } from '../migrations/index';
import { RegistryEntityStatic } from '../../common/registry/entityRegistry';

export class MigrationBootstrapper extends EntityBootstrapper {

  public getInjectableEntities(): RegistryEntityStatic[] {
    return this.getEntitiesFromRegistry('migration');
  }

  public bootstrap(): Promise<void> {

    this.logger.debug(`Running [${this.entities.length}] migrations`);

    const allMigrationPromises = this.entities.map((resolvedMigration: RegistryEntityStatic) => {

      this.logger.info(`migrating ${resolvedMigration.constructor.name}`);
      return this.getInstance<AbstractMigration>(resolvedMigration)
        .migrate()
        .catch((error) => {
          if (error.code === 'ECONNREFUSED'){
            this.logger.notice('Database not available, migration cannot run');
            return;
          }
          throw error;
        });

    }, []);

    return Promise.all(allMigrationPromises);
  }

}
