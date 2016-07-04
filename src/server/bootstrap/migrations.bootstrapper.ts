import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractMigration } from '../migrations/index';

export class MigrationBootstrapper extends EntityBootstrapper {

  public getResolvedProviders(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('migration');
  }

  public bootstrap(): Promise<void> {

    this.logger.debug(`Running [${this.resolvedEntityProviders.length}] migrations`);

    const allMigrationPromises = this.resolvedEntityProviders.map((resolvedMigrationProvider: ResolvedReflectiveProvider) => {

      this.logger.info(`migrating ${resolvedMigrationProvider.key.displayName}`);
      return this.getInstance<AbstractMigration>(resolvedMigrationProvider)
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
