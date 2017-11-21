import { Component, OnInit, Input } from '@angular/core';
import { Resolution } from '../../../models/resolution';
@Component({
  selector: 'mwc-legalbasis-data-form',
  templateUrl: './legalbasis-data-form.component.html',
  styleUrls: ['./legalbasis-data-form.component.css']
})
export class LegalbasisDataFormComponent implements OnInit {
  @Input() legalBasicsDataForm: Resolution;

  selectedYear: string;
  years = [
    { value: 2017, viewValue: '2017' },
    { value: 2016, viewValue: '2016' },
    { value: 2015, viewValue: '2015' },
    { value: 2014, viewValue: '2014' },
  ];

  constructor() {
   }

  ngOnInit() {
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