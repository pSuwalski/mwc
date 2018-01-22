import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'values'
})

export class ValuesPipe implements PipeTransform {

  transform(value: any, args: string[]): any {
    const values = [];
    for (let key in value) {
      values.push(
        _.assign({ key: key }, value[key])
      );
    }
    console.log(values)
    return values;
  }

}
