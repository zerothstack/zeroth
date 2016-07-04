import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractSeeder } from '../seeders/index';

export class SeederBootstrapper extends EntityBootstrapper {

  public getResolvedProviders(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('seeder');
  }

  public bootstrap(): Promise<void> {
    // iterate seeders, to fill the db @todo change to register "unseeded" with the remote cli so
    // they can be executed on demand
    const allSeederPromises = this.resolvedEntityProviders.map((resolvedSeederProvider: ResolvedReflectiveProvider) => {

      this.logger.info(`seeding ${resolvedSeederProvider.key.displayName}`);
      return this.getInstance<AbstractSeeder>(resolvedSeederProvider).seed();

    }, []);

    return Promise.all(allSeederPromises);
  }

}
