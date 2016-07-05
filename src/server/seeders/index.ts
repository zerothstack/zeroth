import { Logger } from '../../common/services/logger.service';
/**
 * Root class that all implementations of seeders *must* extend. Provides common interface for
 * bootstrapper to handle seeding
 */
export abstract class AbstractSeeder {

  protected logger:Logger;
  constructor(loggerBase:Logger){
    this.logger = loggerBase.source(this.constructor.name);
  }

  /**
   * Start the seeding. Returns promise so bootstrapper can wait until finished before starting
   * the next seeder
   */
  public abstract seed():Promise<void>;

}
