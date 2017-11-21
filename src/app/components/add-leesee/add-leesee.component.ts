import { AuthData, PersonalData, ContactData, Leesee } from '../../models/leesee';
import { Component, OnInit } from '@angular/core';
import { LeeseeService } from '../../services/leesee.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/user';

@Component({
  selector: 'mwc-add-leesee',
  templateUrl: './add-leesee.component.html',
  styleUrls: ['./add-leesee.component.css']
})
export class AddLeeseeComponent implements OnInit {

  addedSuccessfully: string;
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

  subscriptions: Subscription[] = [];
  currentUser: User;
  constructor(
    private db: LeeseeService,
    private us: UserService
   ) {
    this.subscriptions.push(
      this.us.currentUser.subscribe((cu) => this.currentUser = cu)
    );
  }

  ngOnInit() {
  }

  add() {
    // this.progressBar = true;
    this.db.addLeesee(this.leesee, this.currentUser.companyId)
      .then((res) => {
        // this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
      // console.log(this.leesee);
  }

}
