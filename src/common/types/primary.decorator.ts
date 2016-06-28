/**
 * This decorator extends the PrimaryColumn decorator from @ubiquits/typeorm to assign the identifierKey
 * of the model.
 * @todo determine if this can be removed by getting key from model another way
 */
import { PrimaryColumn } from '@ubiquits/typeorm/columns';
import {ColumnType} from '@ubiquits/typeorm/metadata/types/ColumnTypes'
import {ColumnOptions} from '@ubiquits/typeorm/decorator/options/ColumnOptions';

export function Primary(options?: ColumnOptions): PropertyDecorator;
export function Primary(type?: ColumnType, options?: ColumnOptions): PropertyDecorator;


export function Primary(typeOrOptions?: ColumnType|ColumnOptions, options?: ColumnOptions): PropertyDecorator {

  let type: ColumnType;
  if (typeof typeOrOptions === "string") {
    type = <ColumnType> typeOrOptions;
  } else {
    options = <ColumnOptions> typeOrOptions;
  }

  const originalDecorator = (PrimaryColumn(type, options) as PropertyDecorator);

  return function primary(target: any, propertyKey: string) {

    originalDecorator(target, propertyKey);

    target.constructor.identifierKey = propertyKey;
  }
}
