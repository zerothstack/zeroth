import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';

export class ControllerBootstrapper extends EntityBootstrapper {

  public getResolvedEntities(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('controller');
  }

  public bootstrap(): void {
    this.resolvedEntityProviders.forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
      this.logger.info(`initializing ${resolvedControllerProvider.key.displayName}`);

      this.injector.instantiateResolved(resolvedControllerProvider)
        .registerInjector(this.injector)
        .registerRoutes();

    });
  }

}
