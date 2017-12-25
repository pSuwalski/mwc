import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import {
  AuthData,
  ContactData,
  emptyOwnerAuth,
  emptyOwnerContact,
  emptyOwnerPersonal,
  emptyParcelData,
  emptyParcelDataFull,
  emptySaldo,
  Owner,
  PersonalData,
  Note,
  ParcelDataFull,
  ParcelData,
} from '../models/owner';
import * as hf from '../helper-functions';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';
import { FinancialRecord, Payment, Cancelation, AdditionalCosts } from '../models/payments';
import { OwnersHistory } from '../models/parcel';

let storedOwner: Owner;

@Injectable()
export class OwnerService {

  searchString: any;
  secondSearchString: any;
  unionId: any;

  editedOwner: Owner;
  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  owners: Owner[];

  constructor(
    private db: AngularFirestore
  ) { }

  storeOwner(owner: Owner) {
    storedOwner = owner;
  }

  async getOwnersFinancialRecords(unionId: string, ownerId: string): Promise<FinancialRecord[]> {
    const paymentSnapshots = await this.ownersRef(unionId).doc(ownerId).collection('financialRecords').ref.get();
    if (paymentSnapshots.empty) {
      return [];
    } else {
      const financialRecords = [];
      paymentSnapshots.docs.forEach((ps) => {
        const financialRecord = ps.data();
        if (financialRecord.type === 'payment') {
          financialRecords.push(financialRecord as Payment);
        } else if (financialRecord.type === 'cancelation') {
          financialRecords.push(financialRecord as Cancelation);
        } else {
          financialRecords.push(financialRecord as AdditionalCosts);
        }
      });
      return financialRecords;
    }
  }

  async getOwnersParcelsData(unionId: string, ownerId: string): Promise<ParcelData[]> {
    const parcelsDataSnapshots = await this.ownersRef(unionId).doc(ownerId).collection('parcelsData').ref.get();
    if (parcelsDataSnapshots.empty) {
      return [];
    } else {
      const parcelsData = [];
      parcelsDataSnapshots.docs.forEach((pds) => {
        const parcel = pds.data();
        parcelsData.push(parcel as ParcelData);
      });
      return parcelsData;
    }
  }

  async restoreOwner(unionId: string, id: string): Promise<Owner> {
    if (storedOwner && storedOwner.id === id) {
      return storedOwner;
    } else {
      const ownerRef = await this.ownersRef(unionId).doc(id).ref.get();
      const paymentsRef = await this.ownersRef(unionId).doc(id).collection('payments').ref.get();
      const notesRef = await this.ownersRef(unionId).doc(id).collection('notes').ref.get();
      const parcelsDataRef = await this.ownersRef(unionId).doc(id).collection('parcelsData').ref.get();
      const payments = [];
      const notes = [];
      const parcelsData = [];
      if (!paymentsRef.empty) {
        paymentsRef.docs.forEach((p) => payments.push(p.data()));
      }
      if (!parcelsDataRef.empty) {
        parcelsDataRef.docs.forEach((p) => parcelsData.push(p.data()));
      }
      if (!notesRef.empty) {
        notesRef.docs.forEach((n) => notes.push(n.data()));
      }
      if (ownerRef.exists) {
        return this.parse(ownerRef.data(), payments, notes, parcelsData);
      } else {
        return null;
      }
    }
  }

  async addOwner(owner: Owner, unionId: string): Promise<any> {
    const id = this.db.createId();
    const address = _.cloneDeep(owner.personalData.address);
    const personalData = { personalData: _.cloneDeep(owner.personalData) };
    delete personalData.personalData.address;
    owner.parcelsData.filter((pd) => pd.id && pd.sectionId).forEach(async (pd: ParcelDataFull) => {
      await this.db.doc(`unions/${unionId}/owners/${owner.id}/parcelsData/${pd.id}`).set(pd);
      const ownersHistory: OwnersHistory = { id, percent: pd.percent, from: pd.from, to: pd.to };
      await this.db
        .doc(`unions/${unionId}/company/${pd.companyId}/parcels/${pd.id}`)
        .collection('ownersHistory')
        .doc(owner.id)
        .set(ownersHistory);
    });
    const dbOwner = _.assign(address, { id },
      owner.contactData, personalData.personalData, {
        historicSaldo: owner.historicSaldo, authData: owner.authData
      });
    return this.db
      .collection('unions')
      .doc(unionId)
      .collection('owners')
      .doc(id)
      .set(hf.capitalizeStrings(dbOwner));

  }

  async replaceOwner(owner: Owner, unionId: string): Promise<any> {
    const id = owner.id;
    if (await this.checkIfExists(`unions/${unionId}/owners/${owner.id}`)) {
      const address = _.cloneDeep(owner.personalData.address);
      const personalData = { personalData: _.cloneDeep(owner.personalData) };
      delete personalData.personalData.address;
      const dbOwner = _.assign(address, { id },
        owner.contactData, personalData.personalData, {
          historicSaldo: owner.historicSaldo, authData: owner.authData
        });
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('owners')
        .doc(owner.id)
        .set(hf.capitalizeStrings(dbOwner));
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getUnionOwners(unionId: string): Promise<Owner[]> {
    this.loadedFromBegining = 0;
    const leeseesRef = await this.ownersRef(unionId).ref.limit(this.limit).get();
    const output: Owner[] = [];
    if (!leeseesRef.empty) {
      this.moreToBeLoadedIndicator = leeseesRef.docs.length === 30;
      this.loadedFromBegining = leeseesRef.docs.length;
      return leeseesRef.docs.map((p) => this.parse(p.data()));
    } else {
      return [];
    }
  }

  isOnArray(array: any[], obj: any): boolean {
    let returnVal = false;

    array.forEach((o) => {
      if (_.isEqual(o, obj)) {
        returnVal = true;
      }
    });

    return returnVal;
  }

  async SearchUnionOwnersByName(unionId: string): Promise<string> {
    const name = this.searchString ? _.capitalize(this.searchString) : '';
    const surname = this.secondSearchString ? _.capitalize(this.secondSearchString) : '';
    if (name.length < 1 && surname.length < 1) {
      this.owners = await this.getUnionOwners(this.unionId);
      return 'ok';
    }
    this.loadedFromBegining = 0;
    const ownerSurnameRef = surname.length > 0 ? await this.ownersRef(unionId).ref.
      where('surname', '>=', surname)
      .where('surname', '<=', surname + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const ownerNameRef = name.length > 0 ? await this.ownersRef(unionId).ref
      .where('name', '>=', name).where('name', '<=', name + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const output: Owner[] = [];
    const outputtemp: Owner[] = [];
    if (ownerNameRef && !ownerNameRef.empty) {
      this.moreToBeLoadedIndicator = ownerNameRef.docs.length === this.limit;
      this.loadedFromBegining = ownerNameRef.docs.length;
      ownerNameRef.docs.forEach((p) => outputtemp.push(this.parse(p.data())));
    }
    if (ownerSurnameRef && !ownerSurnameRef.empty) {
      this.moreToBeLoadedIndicator = ownerSurnameRef.docs.length === this.limit;
      this.loadedFromBegining = ownerSurnameRef.docs.length;
      ownerSurnameRef.docs.forEach((p) => {
        outputtemp.push(this.parse(p.data()));
      });
    }
    outputtemp.forEach((o) => {
      if (!this.isOnArray(output, o)) {
        output.push(o);
      }
    });
    this.owners = output;
    return 'ok';
  }

  async SearchUnionOwnersByEvidenceNumber(unionId: string): Promise<string> {
    const evidenceNumber = _.capitalize(this.searchString);
    let ownerEvidenceNumberRef;
    if (!evidenceNumber) {
      ownerEvidenceNumberRef = await this.ownersRef(unionId).ref.get();
    } else {
      this.loadedFromBegining = 0;
      ownerEvidenceNumberRef = await this.ownersRef(unionId).ref
        .orderBy('evidenceNumber')
        .where('evidenceNumber', '>=', evidenceNumber)
        .where('evidenceNumber', '<=', evidenceNumber + String.fromCharCode(1000))
        .limit(this.limit * 10).get();
    }
    const output: Owner[] = [];
    if (!ownerEvidenceNumberRef.empty) {
      this.moreToBeLoadedIndicator = ownerEvidenceNumberRef.docs.length === this.limit;
      this.loadedFromBegining = ownerEvidenceNumberRef.docs.length;
      ownerEvidenceNumberRef.docs.forEach((p) => {
        output.push(this.parse(p.data()));
      });
    }
    this.owners = output;
    return 'ok';
  }

  async SearchUnionOwnersByAddress(unionId: string): Promise<string> {
    const street = this.searchString ? _.capitalize(this.searchString) : '';
    const city = this.secondSearchString ? _.capitalize(this.secondSearchString) : '';
    console.log(street, city);
    if (street.length < 1 && city.length < 1) {
      this.owners = await this.getUnionOwners(this.unionId);
      return 'ok';
    }
    this.loadedFromBegining = 0;
    const leeseesStreetRef = street.length > 0 ? await this.ownersRef(unionId).ref
      .orderBy('streetAndNumber')
      .where('streetAndNumber', '>=', street)
      .where('streetAndNumber', '<=', street + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const ownerCityRef = city.length > 0 ? await this.ownersRef(unionId).ref
      .orderBy('city')
      .where('city', '>=', city)
      .where('city', '<=', city + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const output: Owner[] = [];
    const outputtemp: Owner[] = [];
    if (leeseesStreetRef && !leeseesStreetRef.empty) {
      this.moreToBeLoadedIndicator = leeseesStreetRef.docs.length === this.limit;
      this.loadedFromBegining = leeseesStreetRef.docs.length;
      leeseesStreetRef.docs.forEach((p) => outputtemp.push(this.parse(p.data())));
    }
    if (ownerCityRef && !ownerCityRef.empty) {
      this.moreToBeLoadedIndicator = ownerCityRef.docs.length === this.limit;
      this.loadedFromBegining = ownerCityRef.docs.length;
      ownerCityRef.docs.forEach((p) => {
        outputtemp.push(this.parse(p.data()));
      });
    }

    outputtemp.forEach((o) => {
      if (!this.isOnArray(output, o)) {
        output.push(o);
      }
    });
    this.owners = output;
    return 'ok';
  }


  parse(dbOwner: any, payments?: FinancialRecord[], notes?: Note[], parcelsData?: ParcelDataFull[]): Owner {
    notes = notes ? notes : [];
    payments = payments ? payments : [];
    const personalData: PersonalData = this.parsePersonalData(dbOwner);
    const contactData = this.parseFromInterface(dbOwner, emptyOwnerContact());
    const authData = [];
    const historicSaldo = dbOwner.historicSaldo;
    const saldo = dbOwner.saldo;
    if (dbOwner.authData) {
      dbOwner.authData.forEach((ad) => authData.push(this.parseFromInterface(ad, emptyOwnerAuth())));
    }
    if (parcelsData) {
      dbOwner.parcelsData.forEach((pd, i) => {
        parcelsData[i] = this.parseFromInterface(pd, emptyParcelDataFull());
      });
    }
    return { personalData, contactData, authData, id: dbOwner.id, historicSaldo, saldo, parcelsData, payments, notes };
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }

  parsePersonalData(parsed: any): PersonalData {
    return _.omitBy({
      type: parsed.type,
      evidenceNumber: parsed.evidenceNumber,
      name: parsed.name,
      surname: parsed.surname,
      address: _.omitBy({
        streetAndNumber: parsed.streetAndNumber,
        city: parsed.city,
        postCode: parsed.postCode,
        apartment: parsed.apartment,
      }, (v) => _.isNull(v) || _.isUndefined(v)),
      nip: parsed.nip,
      regon: parsed.regon,
      krs: parsed.krs,
      pesel: parsed.pesel
    }, (v) => _.isNull(v) || _.isUndefined(v));
  }


  ownersRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('owners');
  }

  setPayment(payment: FinancialRecord, ownerId: string, unionId: string) {
    payment.id = this.db.createId();
    return this.ownersRef(unionId).doc(ownerId).collection('payments').doc(payment.id).set(payment);
  }

  removePayment(payment: FinancialRecord, ownerId: string, unionId: string) {
    payment.id = this.db.createId();
    return this.ownersRef(unionId).doc(ownerId).collection('payments').doc(payment.id).delete();
  }

  async removeParcel(parcelData: ParcelData, ownerId: string, unionId: string) {
    await this.ownersRef(unionId).doc(ownerId).collection('parcelsData').doc(parcelData.id).delete();
    return this.db.doc(`unions/${unionId}/companies/${parcelData.companyId}/parcels/${parcelData.id}`)
      .collection('ownersHistory').doc(ownerId).delete();
  }

  setNote(note: Note, ownerId: string, unionId: string) {
    note.id = this.db.createId();
    console.log(note);
    return this.ownersRef(unionId).doc(ownerId).collection('notes').doc(note.id).set(note);
  }

  removeNote(note: Note, ownerId: string, unionId: string) {
    return this.ownersRef(unionId).doc(ownerId).collection('notes').doc(note.id).delete();
  }


}



