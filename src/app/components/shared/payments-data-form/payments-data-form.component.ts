import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwc-payments-data-form',
  templateUrl: './payments-data-form.component.html',
  styleUrls: ['./payments-data-form.component.css']
})
export class PaymentsDataFormComponent implements OnInit {
  payments: Payment[] = [
    {value: undefined, 'date': ''}
  ];

  constructor() { }

  ngOnInit() {
  }

  addPayment() {
    this.payments.push({ value: undefined, 'date': '' });
  }
}

export interface Payment {
  value: number;
  date: string;
}

