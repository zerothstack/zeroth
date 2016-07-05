/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractSeeder } from '../seeders/index';
import { RegistryEntityStatic } from '../../common/registry/entityRegistry';

export class SeederBootstrapper extends EntityBootstrapper {

  public getInjectableEntities(): RegistryEntityStatic[] {
    return this.getEntitiesFromRegistry('seeder');
  }

  public bootstrap(): Promise<void> {
    // iterate seeders, to fill the db @todo change to register "unseeded" with the remote cli so
    // they can be executed on demand
    const allSeederPromises = this.entities.map((resolvedSeeder: RegistryEntityStatic) => {

      return this.getInstance<AbstractSeeder>(resolvedSeeder).seed();

    }, []);

    return Promise.all(allSeederPromises);
  }

}
