import { AuthData, PersonalData, ContactData, Owner, emptyOwnerPersonal, emptyOwnerContact, emptySaldo } from '../../models/owner';
import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/user';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit, OnDestroy {

  addedSuccessfully: string;

  owner: Owner = {
    personalData: emptyOwnerPersonal(),
    contactData: emptyOwnerContact(),
    authData: [],
    id: null,
    historicSaldo: emptySaldo()
  };

  subscriptions: Subscription[] = [];
  currentUser: User;
  constructor(
    private db: OwnerService,
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
    this.db.addOwner(this.owner, this.currentUser.unionId)
      .then((res) => {
        // this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
    // console.log(this.leesee);
  }

  addAuth() {
    this.owner.authData.push(
      {
        authScope: null, correspondenceAddress: null, email: null, nameSurname: null, pesel: null,
        phoneNumber: null, validFrom: null, validTill: null
      }
    );
  }

  removeAuth() {
    this.owner.authData.pop();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
