/**
 * @module server
 */
/** End Typedoc Module Declaration */
import { Database } from '../services/database.service';
import { Logger } from '../../common/services/logger.service';
/**
 * Root class that all implementations of seeders *must* extend. Provides common interface for
 * bootstrapper to handle seeding
 */
export abstract class AbstractMigration {

  protected logger:Logger;
  constructor(loggerBase:Logger, protected database:Database){
    this.logger = loggerBase.source(this.constructor.name);
  }

  /**
   * Starts the migration. Returns promise so bootstrapper can wait until finished before starting
   * the next migration
   */
  public abstract migrate():Promise<void>;

  /**
   * Reverts the migration. Returns promise so bootstrapper can wait until finished before rolling
   * back the next migration
   */
  public abstract rollback():Promise<void>;

}
