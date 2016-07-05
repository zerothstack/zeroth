/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractMigration } from '../migrations/index';
import { RegistryEntityStatic } from '../../common/registry/entityRegistry';

/**
 * Provides bootstrapping of the @[[Migration]] entities
 */
export class MigrationBootstrapper extends EntityBootstrapper {

  /**
   * Returns all migrations registered to the [[EntityRegistry]]
   */
  public getInjectableEntities(): RegistryEntityStatic[] {
    return this.getEntitiesFromRegistry('migration');
  }

  /**
   * Runs all migrations, awaiting completion of all before the main bootstrapper proceed
   * @todo update to assign tasks to the remote cli so it doesn't happen on startup
   * @returns {Promise<any>|Promise<void[]>}
   */
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
