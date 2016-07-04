import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractSeeder } from '../seeders/index';

export class SeederBootstrapper extends EntityBootstrapper {

  public getResolvedEntities(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('seeder');
  }

  public bootstrap(): Promise<void> {
    // iterate seeders, to fill the db @todo change to register "unseeded" with the remote cli so
    // they can be executed on demand
    const allSeederPromises = this.resolvedEntityProviders.map((resolvedControllerProvider: ResolvedReflectiveProvider) => {

      this.logger.info(`seeding ${resolvedControllerProvider.key.displayName}`);
      return (this.injector.instantiateResolved(resolvedControllerProvider) as AbstractSeeder).seed();

    }, []);
    
    return Promise.all(allSeederPromises);
  }

}
