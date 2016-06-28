/**
 * This decorator extends the Table decorator from @ubiquits/typeorm
 * of the model.
 * @todo determine if this can be removed by getting key from model another way
 */
import { Table } from '@ubiquits/typeorm/tables';
import { TableOptions } from '@ubiquits/typeorm/decorator/options/TableOptions';

export function StoredModel(name?: string, options?: TableOptions): ClassDecorator {

  const originalDecorator = (Table(name, options) as ClassDecorator);

  return function (target: Function) {

    originalDecorator(target);

    // @todo assign a property to the model so the frontend stores can retrieve the api url
  }
}
