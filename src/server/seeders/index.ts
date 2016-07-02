import { Logger } from '../../common/services/logger.service';
export abstract class BaseSeeder {

  protected logger:Logger;
  constructor(loggerBase:Logger){
    this.logger = loggerBase.source(this.constructor.name);
  }

  public abstract seed():Promise<void>;

}
