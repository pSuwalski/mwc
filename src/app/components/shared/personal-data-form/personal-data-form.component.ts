import { ObjectUnsubscribedError } from 'rxjs/Rx';
import { Component, OnInit, Input } from '@angular/core';
import { PersonalData } from '../../../models/owner';

@Component({
  selector: 'mwc-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.css']
})
export class PersonalDataFormComponent implements OnInit {

  @Input() personalDataForm: PersonalData;

  constructor() {
  }

  clearForm() {
    if (this.personalDataForm.type === 'company') {
      this.personalDataForm.surname = null;
      this.personalDataForm.pesel = null;
      this.personalDataForm.name = null;
    } else {
      this.personalDataForm.krs = null;
      this.personalDataForm.nip = null;
      this.personalDataForm.name = null;
      this.personalDataForm.regon = null;
    }
  }

  ngOnInit() {
  }
}

