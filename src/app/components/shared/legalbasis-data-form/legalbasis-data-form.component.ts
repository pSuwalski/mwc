import { Component, OnInit, Input } from '@angular/core';
import { ResolutionData } from '../../../models/resolution';
@Component({
  selector: 'mwc-legalbasis-data-form',
  templateUrl: './legalbasis-data-form.component.html',
  styleUrls: ['./legalbasis-data-form.component.css']
})
export class LegalbasisDataFormComponent implements OnInit {
  @Input() legalBasicsDataForm: ResolutionData[];

  constructor() {
   }

  ngOnInit() {
  }

  addLegalBasis() {
    console.log(this);
    this.legalBasicsDataForm.push({
      number: undefined, date: undefined, paymentI: undefined, paymentIPercent: undefined, paymentII: undefined,
      paymentIIPercent: undefined, paymentIII: undefined, paymentIIIPercent: undefined, paymentIV: undefined,
      paymentIVPercent: undefined, paymentMoreOneHour: undefined, paymentLessOneHour: undefined
    });
  }

  printBasis() {
    console.log(this.legalBasicsDataForm);
  }
}

export interface UserLegalBasicsData {
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