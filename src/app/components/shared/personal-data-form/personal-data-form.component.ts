import { ObjectUnsubscribedError } from 'rxjs/Rx';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.css']
})
export class PersonalDataFormComponent implements OnInit {

  @Input() personalDataForm: UserPersonalData;

  constructor() {
  }

  ngOnInit() {
  }
}

export interface UserPersonalData {
  evidenceNumber: number;
  name: string;
  surname: string;
  pesel: number;
  postalCode: string;
  city: string;
  street: string;
  number: number;
}
