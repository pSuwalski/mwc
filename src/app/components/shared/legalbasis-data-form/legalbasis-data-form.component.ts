import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwc-legalbasis-data-form',
  templateUrl: './legalbasis-data-form.component.html',
  styleUrls: ['./legalbasis-data-form.component.css']
})
export class LegalbasisDataFormComponent implements OnInit {
  legalBasics: legalBasis[] = [
    {
      number: undefined, date: undefined, paymentI: undefined, paymentIPercent: undefined, paymentII: undefined,
      paymentIIPercent: undefined, paymentIII: undefined, paymentIIIPercent: undefined, paymentIV: undefined,
      paymentIVPercent: undefined, paymentMoreOneHour: undefined, paymentLessOneHour: undefined
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  addLegalBasis() {
    this.legalBasics.push({
      number: undefined, date: undefined, paymentI: undefined, paymentIPercent: undefined, paymentII: undefined,
      paymentIIPercent: undefined, paymentIII: undefined, paymentIIIPercent: undefined, paymentIV: undefined,
      paymentIVPercent: undefined, paymentMoreOneHour: undefined, paymentLessOneHour: undefined
    });
  }

  printBasis() {
    console.log(this.legalBasics);
  }
}

export interface legalBasis {
  number: number;
  date: string;
  paymentI: string;
  paymentIPercent: number;
  paymentII: string;
  paymentIIPercent: number;
  paymentIII: string;
  paymentIIIPercent: number;
  paymentIV: string;
  paymentIVPercent: number;
  paymentMoreOneHour: number;
  paymentLessOneHour: number;
}
