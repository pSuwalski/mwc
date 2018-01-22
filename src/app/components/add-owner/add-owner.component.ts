import {
  AuthData, PersonalData, ContactData, Owner, emptyOwnerPersonal,
  emptyOwnerContact, emptySaldo, emptyParcelData, ParcelData, emptyParcelDataFull
} from '../../models/owner';
import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/user';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { emptyAddress } from '../../models/address';
import { MdDialog } from '@angular/material';
import { AuthorizationsDataFormComponent } from '../shared/authorizations-data-form/authorizations-data-form.component';
import { DialogService } from '../../services/dialog.service';
import { AuthorizationsDialogComponent } from '../shared/authorizations-dialog/authorizations-dialog.component';
import { OwnerParcelFormComponent } from '../shared/owner-parcel-form/owner-parcel-form.component';
import { ParcelDialogComponent } from '../shared/parcel-dialog/parcel-dialog.component';
import { SameAddressDialogComponent } from '../shared/same-address-dialog/same-address-dialog.component';

@Component({
  selector: 'mwc-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit, OnDestroy {
  progressBar: boolean;

  addedSuccessfully: string;

  owner: Owner = {
    personalData: emptyOwnerPersonal(),
    contactData: emptyOwnerContact(),
    authData: [],
    id: null,
    parcelsData: []
  };

  subscriptions: Subscription[] = [];
  currentUser: User;
  constructor(
    private db: OwnerService,
    private ds: DialogService,
    private dialog: MdDialog,
    private us: UserService
  ) {
    this.subscriptions.push(
      this.us.currentUser.subscribe((cu) => this.currentUser = cu)
    );
  }

  ngOnInit() {
  }

  add() {
    this.progressBar = true;
    this.owner.parcelsData.forEach((pd) => {
      pd.percent = Math.min(pd.percent, 100);
      pd.percent = Math.max(pd.percent, 0);
      if (!pd.id) {
        _.remove(this.owner.parcelsData, pd);
      }
    });
    this.owner.authData.forEach((ad) => {
      if (!ad.name || !ad.surname) {
        _.remove(this.owner.authData, ad);
      }
    });
    this.db.addOwner(this.owner, this.currentUser.unionId)
      .then((res) => {
        this.addedSuccessfully = 'success';
        this.progressBar = false;
      })
      .catch((e) => console.log(e));
  }

  addAuth() {
    this.ds.inputData = {
      authScope: null, correspondenceAddress: emptyAddress(), email: null, name: null, surname: null, pesel: null,
      phoneNumber: null, validFrom: null, validTill: null
    };
    const dialogRef = this.dialog.open(AuthorizationsDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.authData.push(this.ds.inputData);
      }
    });
  }

  addParcel() {
    this.ds.inputData = emptyParcelDataFull();
    const dialogRef = this.dialog.open(ParcelDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.parcelsData.push(this.ds.inputData);
      }
    });
  }

  editAuth(authData: AuthData) {
    this.ds.inputData = _.cloneDeep(authData);
    const dialogRef = this.dialog.open(AuthorizationsDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.authData.find((a) => a === authData)[0] = _.cloneDeep(this.ds.inputData);
      }
    });
  }

  editParcel(parcelData: ParcelData) {
    this.ds.inputData = _.cloneDeep(parcelData);
    const dialogRef = this.dialog.open(ParcelDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.parcelsData.find((a) => a === parcelData)[0] = _.cloneDeep(this.ds.inputData);
      }
    });
  }


  init() {
    this.addedSuccessfully = null;
    this.owner = {
      personalData: emptyOwnerPersonal(),
      contactData: emptyOwnerContact(),
      authData: [],
      id: null,
      parcelsData: []
    };
  }

  removeAuth(authData: AuthData) {
    _.remove(this.owner.authData, authData);
  }

  removeParcel(parcelsData: ParcelData) {
    _.remove(this.owner.parcelsData, parcelsData);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  sameCorrespondenceAddress() {
    console.log(1);
    this.ds.inputData = _.cloneDeep(this.owner.authData);
    const dialogRef = this.dialog.open(SameAddressDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (_.isNumber(result)) {
        this.owner.contactData.address = this.owner.authData[result].correspondenceAddress;
        this.owner.contactData.cellPhoneNumber = this.owner.authData[result].phoneNumber;
        this.owner.contactData.email = this.owner.authData[result].email;
      } else {
        this.owner.contactData.address = emptyAddress();
      }
    });
  }
}

