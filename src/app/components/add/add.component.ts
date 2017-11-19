import { calcBindingFlags } from '@angular/core/src/view/util';
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'mwc-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnDestroy {

  recordType: string;
  subscriptions: Subscription[] = [];


  leesee = new Leesee();

  legalBasicsDataForm: UserLegalBasicsData[] = [
    {
      number: undefined, date: undefined, paymentI: undefined, paymentIPercent: undefined, paymentII: undefined,
      paymentIIPercent: undefined, paymentIII: undefined, paymentIIIPercent: undefined, paymentIV: undefined,
      paymentIVPercent: undefined, paymentMoreOneHour: undefined, paymentLessOneHour: undefined
    }
  ];

  paymentsDataForm: UserPaymentsData = {
    capital: undefined, discontinued: undefined, fullAmount: undefined, interest: undefined, left: undefined,
    payments: undefined, shipmentCost: undefined
  };


  index = 0;

  constructor(
    private ac: ActivatedRoute
  ) {
    this.ac.params.subscribe((p) => {
      this.recordType = p['record_type'];
    });
  }

  next() {
    this.index += 1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
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

export class Leesee {
  personalData: PersonalData;
  contactData: ContactData;
  authData: AuthData;
}

export interface PersonalData {
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

export interface ContactData {
  postalCode: number;
  city: string;
  street: string;
  number: number;
  email: string;
  deskPhoneNumber: number;
  cellPhoneNumber: number;
}

export interface AuthData {
  nameSurname: string;
  pesel: number;
  phoneNumber: number;
  email: string;
  correspondenceAddress: string;
  authScope: string;
  validFrom: string;
  validTill: string;
}
