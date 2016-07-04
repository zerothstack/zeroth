import { ResolvedReflectiveProvider } from '@angular/core';
import { EntityBootstrapper } from './entity.bootstrapper';
import { AbstractController } from '../controllers/abstract.controller';

export class ControllerBootstrapper extends EntityBootstrapper {

  public getResolvedProviders(): ResolvedReflectiveProvider[] {
    return this.getResolvedFromRegistry('controller');
  }

  public bootstrap(): void {
    this.resolvedEntityProviders.forEach((resolvedControllerProvider: ResolvedReflectiveProvider) => {
      this.logger.info(`initializing ${resolvedControllerProvider.key.displayName}`);

      let controller = this.getInstance<AbstractController>(resolvedControllerProvider);

      controller.registerInjector(this.injector)
        .registerRoutes();

    });
  }

}
