import { Component, OnInit } from '@angular/core';
import { Resolution } from '../../models/resolution';

@Component({
  selector: 'mwc-add-resolution',
  templateUrl: './add-resolution.component.html',
  styleUrls: ['./add-resolution.component.css']
})
export class AddResolutionComponent implements OnInit {

  resolution: Resolution[] = [
    {
      number: null, date: null, paymentI: null, paymentIPercent: null, paymentII: null,
      paymentIIPercent: null, paymentIII: null, paymentIIIPercent: null, paymentIV: null,
      paymentIVPercent: null, paymentMoreOneHour: null, paymentLessOneHour: null
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}