import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Payment } from '../models/payments';

@Pipe({
  name: 'yearPayments'
})

export class YearPaymentsPipe implements PipeTransform {

  transform(value: Payment[], arg: string): any {
    return value
      .filter((v) => String(v.forYear) === String(arg) || !arg)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

}
