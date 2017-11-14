import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-worksdone-data-form',
  templateUrl: './worksdone-data-form.component.html',
  styleUrls: ['./worksdone-data-form.component.css']
})
export class WorksdoneDataFormComponent implements OnInit {

  @Input() worksdoneDataForm: UserWorksdoneData;
  constructor() { }

  ngOnInit() {
  }

}

export interface UserWorksdoneData {
  startedFromDate: string;
  finishedDate: string;
  protocolNumber: number;
  type: string;
  additionalDesc: string;
  totalCost: number;
}
