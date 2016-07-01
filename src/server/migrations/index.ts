import { Database } from '../services/database.service';
import { Logger } from '../../common/services/logger.service';
export abstract class BaseMigration {

  protected logger:Logger;
  constructor(loggerBase:Logger, protected database:Database){
    this.logger = loggerBase.source(this.constructor.name);
  }

  public abstract migrate():Promise<void>;
  public abstract rollback():Promise<void>;

}
