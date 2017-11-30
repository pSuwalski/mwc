import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import {
  Owner, PersonalData, ContactData,
  AuthData, emptySaldo, emptyOwnerContact,
  emptyOwnerPersonal, emptyOwnerAuth
} from '../models/owner';
import * as hf from '../helper-functions';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';

@Injectable()
export class OwnerService {

  editedOwner: Owner;
  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  parcels: Owner[];

  constructor(
    private db: AngularFirestore
  ) { }

  async addOwner(owner: Owner, unionId: string): Promise<any> {
    const id = this.db.createId();
    const dbOwner = _.assign({ id }, owner.contactData, owner.personalData, {
      historicSaldo: owner.historicSaldo, authData: owner.authData, parcelsData: owner.parcelsData
    });
    return this.db
      .collection('unions')
      .doc(unionId)
      .collection('owners')
      .doc(id)
      .set(dbOwner);

  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanyOwners(unionId: string): Promise<Owner[]> {
    this.loadedFromBegining = 0;
    const leeseesRef = await this.ownerRef(unionId).ref.limit(this.limit).get();
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

  async SearchCompanyOwnersByName(unionId: string, nameSurname: string): Promise<Owner[]> {
    this.loadedFromBegining = 0;
    const ownerSurnameRef = await this.ownerRef(unionId).ref.
      where('surname', '>=', nameSurname).where('surname', '<=', nameSurname + String.fromCharCode(1000))
      .limit(this.limit * 10).get();
    const ownerNameRef = await this.ownerRef(unionId).ref
      .where('name', '>=', nameSurname).where('name', '<=', nameSurname + String.fromCharCode(1000))
      .limit(this.limit * 10).get();
    const output: Owner[] = [];
    const outputtemp: Owner[] = [];
    if (!ownerNameRef.empty) {
      this.moreToBeLoadedIndicator = ownerNameRef.docs.length === 30;
      this.loadedFromBegining = ownerNameRef.docs.length;
      ownerNameRef.docs.forEach((p) => outputtemp.push(this.parse(p.data())));
    }
    if (!ownerSurnameRef.empty) {
      this.moreToBeLoadedIndicator = ownerSurnameRef.docs.length === 30;
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
    return output;
  }

  async SearchCompanyOwnersByEvidenceNumber(unionId: string, evidenceNumber: string): Promise<Owner[]> {
    let ownerEvidenceNumberRef;
    if (!evidenceNumber) {
      ownerEvidenceNumberRef = await this.ownerRef(unionId).ref.get();
    } else {
      this.loadedFromBegining = 0;
      ownerEvidenceNumberRef = await this.ownerRef(unionId).ref.
        where('evidenceNumber', '==', evidenceNumber)
        .limit(this.limit * 10).get();
    }
    const output: Owner[] = [];
    if (!ownerEvidenceNumberRef.empty) {
      this.moreToBeLoadedIndicator = ownerEvidenceNumberRef.docs.length === 30;
      this.loadedFromBegining = ownerEvidenceNumberRef.docs.length;
      ownerEvidenceNumberRef.docs.forEach((p) => {
        output.push(this.parse(p.data()));
      });
    }
    return output;
  }

  async SearchCompanyOwnersByAddress(unionId: string, address: string): Promise<Owner[]> {
    this.loadedFromBegining = 0;
    const ownerCityRef = await this.ownerRef(unionId).ref.
      where('city', '>=', address).where('city', '<=', address + String.fromCharCode(1000))
      .limit(this.limit * 10).get();
    const leeseesStreetRef = await this.ownerRef(unionId).ref
      .where('street', '>=', address).where('street', '<=', address + String.fromCharCode(1000))
      .limit(this.limit * 10).get();
    const output: Owner[] = [];
    const outputtemp: Owner[] = [];
    if (!leeseesStreetRef.empty) {
      this.moreToBeLoadedIndicator = leeseesStreetRef.docs.length === 30;
      this.loadedFromBegining = leeseesStreetRef.docs.length;
      leeseesStreetRef.docs.forEach((p) => outputtemp.push(this.parse(p.data())));
    }
    if (!ownerCityRef.empty) {
      this.moreToBeLoadedIndicator = ownerCityRef.docs.length === 30;
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
    return output;
  }


  parse(dbOwner: any): Owner {
    const personalData: PersonalData = this.parseFromInterface(dbOwner, emptyOwnerPersonal());
    const contactData = this.parseFromInterface(dbOwner, emptyOwnerContact());
    const authData = [];
    const historicSaldo = this.parseFromInterface(dbOwner.historicSaldo, emptySaldo());
    if (dbOwner.authData) {
      dbOwner.authData.forEach((ad) => authData.push(this.parseFromInterface(ad, emptyOwnerAuth())));
    }
    return { personalData, contactData, authData, id: dbOwner.id, historicSaldo };
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }


  ownerRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('owners');
  }
}



