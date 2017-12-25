import { Component, OnInit, Input } from '@angular/core';
import { FinancialRecord, Cancelation, AdditionalCosts, Payment } from '../../../models/payments';


@Component({
  selector: 'mwc-payments-data-form',
  templateUrl: './payments-data-form.component.html',
  styleUrls: ['./payments-data-form.component.css']
})
export class PaymentsDataFormComponent implements OnInit {

  @Input() financialRecord: any;
  @Input() editionDisabled = false;
  years: number[];

  constructor(
  ) {
    const year = new Date().getFullYear() + 1;
    this.years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => year - v);
  }

  ngOnInit() {
  }



}


