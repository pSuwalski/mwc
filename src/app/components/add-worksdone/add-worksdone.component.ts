import { Component, OnInit } from '@angular/core';
import { Works } from '../../models/works';

@Component({
  selector: 'mwc-add-worksdone',
  templateUrl: './add-worksdone.component.html',
  styleUrls: ['./add-worksdone.component.css']
})
export class AddWorksdoneComponent implements OnInit {

  works: Works = {
    additionalDesc: null, finishedDate: null, protocolNumber: null, startedFromDate: null,
    totalCost: null, type: null
  };

  constructor() { }

  ngOnInit() {
  }

}
