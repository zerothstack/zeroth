/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractService } from '../../common/services/service';
import { RegistryEntityStatic, EntityMetadata } from '../../common/registry/entityRegistry';

/**
 * Provides bootstrapping of the @[[Service]] entities
 */
export class ServiceBootstrapper extends EntityBootstrapper {

  /**
   * Returns all services registered to the [[EntityRegistry]]
   */
  public getInjectableEntities(): RegistryEntityStatic<EntityMetadata>[] {
    return this.getEntitiesFromRegistry('service');
  }

  /**
   * Bootstrap all services. With each service, the initialize function is invoked, and the bootstrap
   * awaits all services to complete initializing before resolving the promise
   * @returns {Promise<any>|Promise<AbstractService[]>}
   */
  public bootstrap(): Promise<void> {

    this.logger.debug(`Initializing [${this.entities.length}] services`);

    const allServicePromises = this.entities.map((resolvedService: RegistryEntityStatic<EntityMetadata>) => {

      let service = this.getInstance<AbstractService>(resolvedService);

      return Promise.resolve(service.initialize());
    }, []);

    return Promise.all(allServicePromises);
  }

}
