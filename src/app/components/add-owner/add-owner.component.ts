import { AuthData, PersonalData, ContactData, Owner, emptyOwnerPersonal,
         emptyOwnerContact, emptySaldo, emptyParcelData, ParcelData, emptyParcelDataFull } from '../../models/owner';
import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/user';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { emptyAddress } from '../../models/address';

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
    historicSaldo: emptySaldo(),
    parcelsData: []
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
    this.db.addOwner(this.owner, this.currentUser.unionId)
      .then((res) => {
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  addAuth() {
    this.owner.authData.push(
      {
        authScope: null, correspondenceAddress: emptyAddress(), email: null, name: null, surname: null, pesel: null,
        phoneNumber: null, validFrom: null, validTill: null
      }
    );
  }

  addParcel() {
    this.owner.parcelsData.push(emptyParcelDataFull());
  }

  removeAuth() {
    this.owner.authData.pop();
  }

  removeParcel() {
    this.owner.parcelsData.pop();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  sameCorrespondenceAddress() {
    if (this.owner.contactData.address === this.owner.personalData.address) {
      this.owner.contactData.address = emptyAddress();
    } else {
      this.owner.contactData.address = this.owner.personalData.address;
    }
  }

}
