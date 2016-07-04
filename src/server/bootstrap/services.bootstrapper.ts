import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractService } from '../../common/services/service';

export class ServiceBootstrapper extends EntityBootstrapper {

  public getResolvedProviders(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('service');
  }

  public bootstrap(): Promise<void> {

    this.logger.debug(`Initializing [${this.resolvedEntityProviders.length}] services`);

    const allServicePromises = this.resolvedEntityProviders.map((resolvedServiceProvider: ResolvedReflectiveProvider) => {

      let service =  this.getInstance<AbstractService>(resolvedServiceProvider);

      return Promise.resolve(service.initialize());
    }, []);

    return Promise.all(allServicePromises);
  }

}
