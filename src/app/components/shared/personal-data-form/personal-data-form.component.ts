import { ObjectUnsubscribedError } from 'rxjs/Rx';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.css']
})
export class PersonalDataFormComponent implements OnInit {

  @Input() personalDataForm: UserPersonalData = {
    evidenceNumber: undefined, name: undefined, surname: undefined, pesel: undefined,
    postalCode: undefined, city: undefined, street: undefined, number: undefined,
  };

  constructor() {
  }

  ngOnInit() {
  }

  clicked () {
    console.log(this.personalDataForm);
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
