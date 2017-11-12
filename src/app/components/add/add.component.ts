import { calcBindingFlags } from '@angular/core/src/view/util';
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'mwc-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  personalDataForm: UserPersonalData = {
    evidenceNumber: undefined, name: undefined, surname: undefined, pesel: undefined,
    postalCode: undefined, city: undefined, street: undefined, number: undefined,
    krs: undefined, nip: undefined, regon: undefined
  };

  contactDataForm: UserContactData = {
    postalCode: undefined, city: undefined, street: undefined, number: undefined,
    email: undefined, deskPhoneNumber: undefined, cellPhoneNumber: undefined
  };

  authDataForm: UserAuthData = {
    nameSurname: undefined, pesel: undefined, authScope: undefined, correspondenceAddress: undefined,
    email: undefined, phoneNumber: undefined, validFrom: undefined, validTill: undefined
  };

  model: Model = {
    personalDataForm: this.personalDataForm,
    contactDataForm: this.contactDataForm,
    authDataForm: this.authDataForm,
  };

  public index = 0;

  clicked() {
    console.log(this.model);
  }

  next() {
    this.index += 1;
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
  krs: number;
  nip: number;
  regon: number;
}

export interface UserContactData {
  postalCode: number;
  city: string;
  street: string;
  number: number;
  email: string;
  deskPhoneNumber: number;
  cellPhoneNumber: number;
}

export interface UserAuthData {
  nameSurname: string;
  pesel: number;
  phoneNumber: number;
  email: string;
  correspondenceAddress: string;
  authScope: string;
  validFrom: string;
  validTill: string;
}

export class Model {
  personalDataForm: UserPersonalData;
  contactDataForm: UserContactData;
  authDataForm: UserAuthData;
}

