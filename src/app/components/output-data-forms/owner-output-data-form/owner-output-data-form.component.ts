import { OwnerService } from '../../../services/owner.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Owner, emptyOwnerContact, emptyOwnerPersonal, emptySaldo, emptyParcelDataFull, emptyOwnerAuth, AuthData, ParcelData, Note, emptyNote } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';

import * as _ from 'lodash';
import { Payment, FinancialRecord } from '../../../models/payments';
import { DialogService } from '../../../services/dialog.service';
import { MdDialog } from '@angular/material';
import { ParcelDialogComponent } from '../../shared/parcel-dialog/parcel-dialog.component';
import { AuthorizationsDialogComponent } from '../../shared/authorizations-dialog/authorizations-dialog.component';
import { emptyAddress } from '../../../models/address';
import { PaymentsDialogComponent } from '../../shared/payments-dialog/payments-dialog.component';
import { NotesDialogComponent } from '../../shared/notes-dialog/notes-dialog.component';
import { DocumentService, InputStampAuth } from '../../../services/document.service';
import { NoticePaperDialogComponent } from '../../shared/notice-paper-dialog/notice-paper-dialog.component';
import { CallPaperDialogComponent } from '../../shared/call-paper-dialog/call-paper-dialog.component';
import { PaymentPaperDialogComponent } from '../../shared/payment-paper-dialog/payment-paper-dialog.component';

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
    private doc: DocumentService,
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
            this.currentUser = cu;
            this.progressBar = false;
            if (own !== null) {
              this.owner = own;
              console.log(own)
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
      financialRecord: {
        id: null,
        value: null,
        type: null,
        for: null,
        date: null,
        from: null,
        forYear: null,
        reason: null,
      },
      parcels: this.owner.parcelsData
    };
    const dialogRef = this.dialog.open(PaymentsDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.owner.payments = this.owner.payments ? this.owner.payments : [];
        this.owner.payments.push(this.ds.inputData.financialRecord);
        this.os.setPayment(this.ds.inputData.financialRecord, this.owner.id, this.currentUser.unionId);
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

  uploadPhoto(event) {
    this.progressBar = true;
    const files = event.srcElement.files;
    const id = Math.random().toString(36).substr(2, 9);
    const storageRef = firebase.storage().ref();
    const uploadTask: firebase.storage.UploadTask = storageRef.child('addedDocuments/' + id).put(files[0]);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snap) => { },
      (error) => { },
      () => {
        this.os.db.collection('unions').doc(this.currentUser.unionId)
          .collection('owners').doc(this.owner.id).collection('notes').doc(id).set({
            link: uploadTask.snapshot.downloadURL,
            text: 'Dodano załącznik',
            id,
            date: new Date()
          });
        event.target.value = null;
        setTimeout(async () => {
          this.owner.notes = await this.os.restoreNotes(this.currentUser.unionId, this.owner.id);
          alert(`Dokument został dodany do właściciela możesz zobaczyć go poniezej`);
          this.progressBar = false;
        }, 1000);
      }
    );

  }

  async openNoticePaper() {
    this.ds.inputData = _.cloneDeep(noticePaperData);
    const dialogRef = this.dialog.open(NoticePaperDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.generateNoticePaper(this.ds.inputData);
      }
    });
  }

  async openCallPaper() {
    this.ds.inputData = _.cloneDeep(noticePaperData);
    const dialogRef = this.dialog.open(CallPaperDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.generateCallPaper(this.ds.inputData);
      }
    });
  }

  async openPaymentPaper() {
    this.ds.inputData = _.cloneDeep(paymentPaperData);
    const dialogRef = this.dialog.open(PaymentPaperDialogComponent, { width: '90%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.generatePaymentPaper(this.ds.inputData);
      }
    });
  }

  async generateAuthPaper(authData: AuthData) {
    this.progressBar = true;
    this.doc.generateAuthPaper(this.currentUser.unionId, this.owner.personalData.name + ' ' + this.owner.personalData.surname,
      this.owner.contactData.address.streetAndNumber + ', ' +
      this.owner.contactData.address.postCode + ' ' + this.owner.contactData.address.city,
      String(authData.pesel), String(this.owner.personalData.pesel), this.owner.id, authData.name, authData.surname
    ).map((res) => (res.data || {}).generateAuthPaper).subscribe(async (name) => {
      if (name) {
        alert(`Druk pełnomocnictwa został wygnerowany.
        Naciśnij ok przejść do pliku pdf.
        Będzie on również dostępny w zakładce notatki i dokumenty`);
        const link = await this.os.db.app.storage().ref(name).getDownloadURL();
        this.os.db
          .collection('unions')
          .doc(this.currentUser.unionId)
          .collection('owners')
          .doc(this.owner.id)
          .collection('notes')
          .doc(name).update({ link });
        // this.os.db.collection('unions').doc(this.currentUser.unionId).collection('owners').doc(this.owner.id).collection('notes').doc(name).update({link: name});
        window.open(link, '_blank');
        this.owner.notes = await this.os.restoreNotes(this.currentUser.unionId, this.owner.id);
        this.progressBar = false;
      }
    });
  }

  async generateNoticePaper({ status, resolutionId, name, surname, position, accountName, address, bankAccount, title }: {
    status: string, resolutionId: string, name: string,
    surname: string, position: string, accountName: string, address: string,
    bankAccount: string, title: string
  }) {
    console.log({ status, resolutionId, name, surname, position, accountName, address, bankAccount, title });
    this.progressBar = true;
    const stampAuth: InputStampAuth = { name, surname, position };
    this.doc.generateNoticePaper(this.currentUser.unionId, this.owner.id,
      status, resolutionId, stampAuth, accountName, address, bankAccount, title
    ).map((res) => (res.data || {}).generateNoticePaper).subscribe(async (docName) => {
      if (docName) {
        alert(`Druk zawiadomienia o naliczeniu opłaty został wygnerowany.
        Naciśnij ok przejść do pliku pdf.
        Będzie on również dostępny w zakładce notatki i dokumenty`);
        const link = await this.os.db.app.storage().ref(docName).getDownloadURL();
        this.os.db
          .collection('unions')
          .doc(this.currentUser.unionId)
          .collection('owners')
          .doc(this.owner.id)
          .collection('notes')
          .doc(docName).update({ link });
        window.open(link, '_blank');
        this.owner.notes = await this.os.restoreNotes(this.currentUser.unionId, this.owner.id);
        this.progressBar = false;
      }
    });
  }

  async generateCallPaper({ status, companyId, name, surname, position, cashAddress, bankName, bankAccount, contactPhone, contactEmail }: {
    status: string, companyId: string, name: string,
    surname: string, position: string,
    cashAddress: string, bankName: string, bankAccount: string, contactPhone: string, contactEmail: string
  }) {
    this.progressBar = true;
    const stampAuth: InputStampAuth = { name, surname, position };
    this.doc.generateCallPaper(this.currentUser.unionId, this.owner.id, companyId,
      cashAddress, bankName, bankAccount, contactPhone, contactEmail, stampAuth
    ).map((res) => (res.data || {}).generateCallPaper)
      .do(console.log).subscribe(async (docName) => {
        if (docName) {
          alert(`Druk wezwania do zapłaty został wygnerowany.
          Naciśnij ok przejść do pliku pdf.
          Będzie on również dostępny w zakładce notatki i dokumenty`);
          const link = await this.os.db.app.storage().ref(docName).getDownloadURL();
          this.os.db
            .collection('unions')
            .doc(this.currentUser.unionId)
            .collection('owners')
            .doc(this.owner.id)
            .collection('notes')
            .doc(docName).update({ link });
          window.open(link, '_blank');
          this.owner.notes = await this.os.restoreNotes(this.currentUser.unionId, this.owner.id);
          this.progressBar = false;
        }
      });
  }

  async generatePaymentPaper(
    inputData: {
      unionId: string, ownerId: string, unionBankAccount: string, amount: string,
      payersBankAccount: string, payerName: string, title: string
    }) {
    this.progressBar = true;
    this.doc.generatePaymentPaper(inputData.unionId, inputData.ownerId, inputData.unionBankAccount,
      inputData.amount, inputData.payersBankAccount, inputData.payerName, inputData.title)
      .map((res) => (res.data || {}).generatePaymentPaper).subscribe(async (docName) => {
        if (docName) {
          alert(`Druk zlecenia płatności został wygnerowany.
          Naciśnij ok wygenerować i przejść do pliku pdf.
          Będzie on później dostępny w zakładce notatki i dokumenty`);
          const link = await this.os.db.app.storage().ref(name).getDownloadURL();
          this.os.db
            .collection('unions')
            .doc(this.currentUser.unionId)
            .collection('owners')
            .doc(this.owner.id)
            .collection('notes')
            .doc(name).update({ link });
          window.open(link, '_blank');
          this.owner.notes = await this.os.restoreNotes(this.currentUser.unionId, this.owner.id);
          this.progressBar = false;
        }
      });
  }

  openInNewTab(link: string) {
    window.open(link, '_blank');
  }

}



export const callPaperData = {
  status: null, companyId: null, name: null,
  surname: null, position: null, cashAddress: null,
  bankName: null, bankAccount: null, contactPhone: null, contactEmail: null
};

export const noticePaperData = {
  status: null, resolutionId: null, name: null,
  surname: null, position: null, accountName: null, address: null,
  bankAccount: null, title: null
};

export const paymentPaperData = {
  unionId: null, ownerId: null, unionBankAccount: null,
  amount: null, payersBankAccount: null, payerName: null,
  title: null
};


