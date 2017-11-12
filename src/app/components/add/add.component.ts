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

  legalBasicsDataForm: UserLegalBasicsData[] = [
    {
      number: undefined, date: undefined, paymentI: undefined, paymentIPercent: undefined, paymentII: undefined,
      paymentIIPercent: undefined, paymentIII: undefined, paymentIIIPercent: undefined, paymentIV: undefined,
      paymentIVPercent: undefined, paymentMoreOneHour: undefined, paymentLessOneHour: undefined
    }
  ];

  parcelDataForm: UserParcelData = {
    applianceDescription: undefined, applianceType: undefined, areaSurface: undefined, areaType: undefined,
    drainage: undefined, number: undefined, numbering: undefined, trench: undefined, yearNumber: undefined,
    decisionDate: undefined, decisionNumber: undefined, foremanDecision: undefined, legalBasis: undefined,
    membership: undefined, SwMembershipStartDate: undefined, SwMembershipTerminationDate: undefined
  };

  paymentsDataForm: UserPaymentsData = {
    capital: undefined, discontinued: undefined, fullAmount: undefined, interest: undefined, left: undefined,
    payments: undefined, shipmentCost: undefined
  };

  userData: UserData = {
    personalDataForm: this.personalDataForm,
    contactDataForm: this.contactDataForm,
    authDataForm: this.authDataForm,
    legalBasicsDataForm: this.legalBasicsDataForm,
    parcelDataForm: this.parcelDataForm,
    paymentsDataForm: this.paymentsDataForm,
  };

  public index = 0;

  clicked() {
    console.log(this.userData);
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

export interface UserParcelData {
  number: number;
  areaType: string;
  areaSurface: number;
  trench: boolean;
  yearNumber: number;
  drainage: boolean;
  numbering: number;
  applianceType: string;
  applianceDescription: string;
  membership: boolean;
  legalBasis: string;
  SwMembershipStartDate: string;
  SwMembershipTerminationDate: string;
  foremanDecision: boolean;
  decisionNumber: number;
  decisionDate: string;
}

export interface Payment {
  value: number;
  date: string;
}

export interface UserPaymentsData {
  payments: Payment[];
  fullAmount: number;
  capital: number;
  interest: number;
  shipmentCost: number;
  discontinued: number;
  left: number;
}

export class UserData {
  personalDataForm: UserPersonalData;
  contactDataForm: UserContactData;
  authDataForm: UserAuthData;
  legalBasicsDataForm: UserLegalBasicsData[];
  parcelDataForm: UserParcelData;
  paymentsDataForm: UserPaymentsData;
}

