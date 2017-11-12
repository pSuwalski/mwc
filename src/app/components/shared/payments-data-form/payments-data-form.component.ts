import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-payments-data-form',
  templateUrl: './payments-data-form.component.html',
  styleUrls: ['./payments-data-form.component.css']
})
export class PaymentsDataFormComponent implements OnInit {

  payments: Payment[];

  @Input() paymentsDataForm: UserPaymentsData;

  constructor() {
  }

  ngOnInit() {
    this.payments = [
      {value: undefined, 'date': ''}
    ];
    this.paymentsDataForm.payments = this.payments;
  }

  addPayment() {
    this.payments.push({ value: undefined, 'date': '' });
  }
}

export interface Payment {
  value: number;
  date: string;
}

export interface UserPaymentsData {
  payments: Payment[];
  fullAmount: number;
  capital: number;
  interest: number;
  shipmentCost: number;
  discontinued: number;
  left: number;
}
