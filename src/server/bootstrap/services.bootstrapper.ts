/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractService } from '../../common/services/service';
import { RegistryEntityStatic } from '../../common/registry/entityRegistry';

export class ServiceBootstrapper extends EntityBootstrapper {

  public getInjectableEntities(): RegistryEntityStatic[] {
    return this.getEntitiesFromRegistry('service');
  }

  public bootstrap(): Promise<void> {

    this.logger.debug(`Initializing [${this.entities.length}] services`);

    const allServicePromises = this.entities.map((resolvedService: RegistryEntityStatic) => {

      let service =  this.getInstance<AbstractService>(resolvedService);

      return Promise.resolve(service.initialize());
    }, []);

    return Promise.all(allServicePromises);
  }

}
