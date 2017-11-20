import { AuthData, PersonalData } from '../add/add.component';
import { ContactData, Leesee } from '../../models/leesee';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwc-add-leesee',
  templateUrl: './add-leesee.component.html',
  styleUrls: ['./add-leesee.component.css']
})
export class AddLeeseeComponent implements OnInit {

  leeseePersonal: PersonalData = {
    city: null, evidenceNumber: null, krs: null, name: null, nip: null, number: null, pesel: null,
    postalCode: null, regon: null, street: null, surname: null
  };

  leeseeContact: ContactData = {
    cellPhoneNumber: null, city: null, deskPhoneNumber: null, email: null, number: null,
    postalCode: null, street: null
  };

  leeseeAuth: AuthData = {
    authScope: null, correspondenceAddress: null, email: null, nameSurname: null, pesel: null,
    phoneNumber: null, validFrom: null, validTill: null
  };

  leesee: Leesee = {
    personalData: this.leeseePersonal,
    contactData: this.leeseeContact,
    authData: this.leeseeAuth
  };

  constructor() { }

  ngOnInit() {
  }

}
