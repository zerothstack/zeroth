import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractService } from '../../common/services/service';

export class ServiceBootstrapper extends EntityBootstrapper {

  public getResolvedEntities(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('service');
  }

  public bootstrap(): Promise<void> {

    this.logger.debug(`Initializing [${this.resolvedEntityProviders.length}] services`);

    const allServicePromises = this.resolvedEntityProviders.map((resolvedControllerProvider: ResolvedReflectiveProvider) => {

      this.logger.info(`Initializing ${resolvedControllerProvider.key.displayName}`);
      const service = (this.injector.instantiateResolved(resolvedControllerProvider) as AbstractService).initialize();
      return Promise.resolve(service);
    }, []);

    return Promise.all(allServicePromises);
  }

}
