import { OwnerService } from '../../../services/owner.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Owner, emptyOwnerContact, emptyOwnerPersonal, emptySaldo, emptyParcelDataFull, emptyOwnerAuth, AuthData, ParcelData, Note, emptyNote } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import { Payment, FinancialRecord } from '../../../models/payments';
import { DialogService } from '../../../services/dialog.service';
import { MdDialog } from '@angular/material';
import { ParcelDialogComponent } from '../../shared/parcel-dialog/parcel-dialog.component';
import { AuthorizationsDialogComponent } from '../../shared/authorizations-dialog/authorizations-dialog.component';
import { emptyAddress } from '../../../models/address';
import { PaymentsDialogComponent } from '../../shared/payments-dialog/payments-dialog.component';
import { NotesDialogComponent } from '../../shared/notes-dialog/notes-dialog.component';

@Component({
  selector: 'mwc-owner-output-data-form',
  templateUrl: './owner-output-data-form.component.html',
  styleUrls: ['./owner-output-data-form.component.css']
})
export class OwnerOutputDataFormComponent implements OnInit, OnDestroy {

  // owner: Owner;
  ownerTemp: Owner;
  currentUser: User;
  subsriptions: Subscription[] = [];
  editionDisabled = true;
  progressBar = true;
  addedSuccessfully: string;

  financialRecords: any[] = []; // Financial Record

  owner: Owner = {
    personalData: emptyOwnerPersonal(),
    contactData: emptyOwnerContact(),
    authData: [],
    id: null,
    parcelsData: []
  };
  id: string;

  constructor(
    private router: Router,
    private os: OwnerService,
    private us: UserService,
    private ds: DialogService,
    private dialog: MdDialog,
    private route: ActivatedRoute
  ) {
    this.subsriptions.push(
      this.us.currentUser
        .combineLatest(this.route.params)
        .subscribe(([cu, params]) => {
          this.os.restoreOwner(cu.unionId, params['id']).then(own => {
            this.id = params['id'];
            console.log(own);
            this.currentUser = cu;
            console.log('asdasdas');
            this.progressBar = false;
            if (own !== null) {
              this.owner = own;
              this.os.getOwnersFinancialRecords(this.currentUser.unionId, this.owner.id)
                .then((fr) => this.financialRecords = fr.sort((a, b) => (new Date(a.date)).getTime() - new Date(b.date).getTime()));
            } else {
              this.router.navigate(['/search/owner']);
            }
          });
        })
    );
  }

  ngOnInit() {
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
        this.save();
      }
    });
  }

  addFinancialRecord() {
    this.ds.inputData = {
      id: null,
      value: null,
      type: null,
      for: null,
      date: null,
      from: null,
      forYear: null,
      reason: null
    };
    const dialogRef = this.dialog.open(PaymentsDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.payments = this.owner.payments ? this.owner.payments : [];
        this.owner.payments.push(this.ds.inputData);
        this.os.setPayment(this.ds.inputData, this.owner.id, this.currentUser.unionId);
      }
    });
  }

  addParcel() {
    this.ds.inputData = emptyParcelDataFull();
    const dialogRef = this.dialog.open(ParcelDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.parcelsData = this.owner.parcelsData ? this.owner.parcelsData : [];
        this.owner.parcelsData.push(this.ds.inputData);
        this.os.setParcel(this.ds.inputData, this.owner.id, this.currentUser.unionId).then(() => { });
      }
    });
  }

  addNote() {
    this.ds.inputData = emptyNote();
    const dialogRef = this.dialog.open(NotesDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.notes = this.owner.notes ? this.owner.notes : [];
        this.owner.notes.push(this.ds.inputData);
        this.os.setNote(this.ds.inputData, this.owner.id, this.currentUser.unionId);
      }
    });
  }

  editAuth(authData: AuthData) {
    this.ds.inputData = _.cloneDeep(authData);
    const dialogRef = this.dialog.open(AuthorizationsDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.authData.find((a) => a === authData)[0] = _.cloneDeep(this.ds.inputData);
        this.save();
      }
    });
  }

  editNote(note: Note) {
    this.ds.inputData = _.cloneDeep(note);
    const dialogRef = this.dialog.open(NotesDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.notes.find((a) => a === note)[0] = _.cloneDeep(this.ds.inputData);
        this.os.setNote(this.ds.inputData, this.owner.id, this.currentUser.unionId);
      }
    });
  }

  editPayment(financialRecord: FinancialRecord) {
    this.ds.inputData = _.cloneDeep(financialRecord);
    const dialogRef = this.dialog.open(PaymentsDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.payments.find((a) => a === financialRecord)[0] = _.cloneDeep(this.ds.inputData);
        this.save();
      }
    });
  }

  editParcel(parcelData: ParcelData) {
    this.ds.inputData = _.cloneDeep(parcelData);
    const dialogRef = this.dialog.open(ParcelDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        const index = this.owner.parcelsData.findIndex((p) => p.id === this.ds.inputData.id);
        this.owner.parcelsData[index] = _.cloneDeep(this.ds.inputData);
        this.os.setParcel(this.ds.inputData, this.owner.id, this.currentUser.unionId);
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

  removeNote(note: Note) {
    this.os.removeNote(note, this.owner.id, this.currentUser.unionId);
    _.remove(this.owner.notes, note);
  }

  removeParcel(parcelsData: ParcelData) {
    this.progressBar = true;
    this.editionDisabled = true;
    this.os.removeParcel(_.remove(this.owner.parcelsData, parcelsData)[0], this.owner.id, this.currentUser.unionId).then(() => {
      this.progressBar = false;
    });
  }

  removePayment(financialRecord: FinancialRecord) {
    this.os.removePayment(financialRecord, this.owner.id, this.currentUser.unionId);
    _.remove(this.owner.payments, financialRecord);
  }

  save() {
    console.log(1);
    this.progressBar = true;
    this.editionDisabled = true;
    this.os.replaceOwner(this.owner, this.currentUser.unionId)
      .then((res) => {
        console.log(2);
        this.progressBar = false;
        this.addedSuccessfully = res;
        this.restoreOwner();
      })
      .catch((e) => console.log(e));
  }

  cancel() {
    this.owner = _.cloneDeep(this.ownerTemp);
    this.editionDisabled = true;
  }


  edit() {
    this.ownerTemp = _.cloneDeep(this.owner);
    this.editionDisabled = false;
  }

  goBack() {
    this.router.navigate(['/search/leesee']);
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

  restoreOwner() {
    this.os.restoreOwner(this.currentUser.unionId, this.id).then(own => {
      if (own !== null) {
        this.owner = own;
        this.os.getOwnersFinancialRecords(this.currentUser.unionId, this.owner.id)
          .then((fr) => this.financialRecords = fr.sort((a, b) => (new Date(a.date)).getTime() - new Date(b.date).getTime()));
      } else {
        this.router.navigate(['/search/owner']);
      }
    });
  }

}
