// import { PrimaryColumn } from 'typeorm/columns';
// import {ColumnType} from 'typeorm/metadata/types/ColumnTypes'
// import {ColumnOptions} from 'typeorm/decorator/options/ColumnOptions';
import { ModelConstructor } from '../model';
import { initializeMetadata } from '../../metadata/metadata';
export type ColumnType = any;
export type ColumnOptions = any;

export function Primary(options?: ColumnOptions): PropertyDecorator;
export function Primary(type?: ColumnType, options?: ColumnOptions): PropertyDecorator;

export function Primary(typeOrOptions?: ColumnType|ColumnOptions, options?: ColumnOptions): PropertyDecorator {

  return function primary(target: ModelConstructor<any>, propertyKey: string) {

    initializeMetadata(target);
    target.constructor.__metadata.identifierKey = propertyKey;
  };

  // let type: ColumnType;
  // if (typeof typeOrOptions === "string") {
  //   type = <ColumnType> typeOrOptions;
  // } else {
  //   options = <ColumnOptions> typeOrOptions;
  // }
  //
  // const originalDecorator = (PrimaryColumn(type, options) as PropertyDecorator);
  //
  // return function primary(target: any, propertyKey: string) {
  //
  //   originalDecorator(target, propertyKey);
  //
  //   target.prototype.__identifierKey = propertyKey;
  // }
}
