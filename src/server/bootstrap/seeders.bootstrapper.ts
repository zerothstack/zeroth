/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractSeeder } from '../seeders/index';
import { RegistryEntityStatic } from '../../common/registry/entityRegistry';

/**
 * Provides bootstrapping of the @[[Seeder]] entities
 */
export class SeederBootstrapper extends EntityBootstrapper {

  /**
   * Returns all seeders registered to the [[EntityRegistry]]
   */
  public getInjectableEntities(): RegistryEntityStatic[] {
    return this.getEntitiesFromRegistry('seeder');
  }

  /**
   * Runs all seeders, awaiting completion of all before the main bootstrapper proceed
   * @todo update to assign tasks to the remote cli so it doesn't happen on startup
   * @returns {Promise<any>|Promise<void[]>}
   */
  public bootstrap(): Promise<void> {
    const allSeederPromises = this.entities.map((resolvedSeeder: RegistryEntityStatic) => {

      return this.getInstance<AbstractSeeder>(resolvedSeeder).seed();

    }, []);

    return Promise.all(allSeederPromises);
  }

}
