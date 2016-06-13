import * as moment from "moment";
import { BaseModel } from '../models/base.model';
export function castDate(target: any, propertyKey: string) {

  if (!target.__typeCasts) {
    target.__typeCasts = new Map();
  }

  target.__typeCasts.set(propertyKey, (value: string, reference:BaseModel) => moment(value));
}
