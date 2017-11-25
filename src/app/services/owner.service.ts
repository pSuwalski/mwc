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

  editedLeesee: Owner;
  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  parcels: Owner[];

  constructor(
    private db: AngularFirestore
  ) { }

  async addOwner(leesee: Owner, unionId: string): Promise<any> {
    const id = this.db.createId();
    if (! await this.checkIfExists(`unions/${unionId}/percels/${id}`)) {
      console.log(hf.createDbObject(leesee));
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('leesees')
        .doc(leesee.personalData.evidenceNumber.toString())
        .set(hf.createDbObject(_.assign(leesee, { id })));
    } else {
      return Promise.resolve(false);
    }
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

  async SearchCompanyOwnersByName(unionId: string, searchString: string): Promise<Owner[]> {
    this.loadedFromBegining = 0;
    const leeseesSurnameRef = await this.ownerRef(unionId).ref.
      where('surname', '>=', searchString)
      .limit(this.limit * 10).get();
    const leeseesNameRef = await this.ownerRef(unionId).ref
      .where('name', '>=', searchString).where('name', '<=', searchString + 'z')
      .limit(this.limit * 10).get();
    const output: Owner[] = [];
    if (!leeseesNameRef.empty) {
      this.moreToBeLoadedIndicator = leeseesNameRef.docs.length === 30;
      this.loadedFromBegining = leeseesNameRef.docs.length;
      leeseesNameRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    if (!leeseesSurnameRef.empty) {
      this.moreToBeLoadedIndicator = leeseesSurnameRef.docs.length === 30;
      this.loadedFromBegining = leeseesSurnameRef.docs.length;
      leeseesSurnameRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    return output;
  }


  parse(dbLeesee: any): Owner {
    const personalData: PersonalData = this.parseFromInterface(dbLeesee, emptyOwnerPersonal);
    const contactData = this.parseFromInterface(dbLeesee, emptyOwnerContact);
    const authData = [];
    const historicSaldo = this.parseFromInterface(dbLeesee.historicSaldo, emptySaldo);
    if (dbLeesee.authData) {
      dbLeesee.authData.forEach((ad) => authData.push(this.parseFromInterface(ad, emptyOwnerAuth)));
    }
    return { personalData, contactData, authData, id: dbLeesee.id, historicSaldo };
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }


  // leeseeRef(companyId: string, leeseeId: string) {
  //   return this.db.collection('companies').doc(companyId).collection('percels').doc(leeseeId);
  // }

  ownerRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('leesees');
  }
}

export const emptyLeesee: Owner = {
  personalData: null,
  contactData: null,
  authData: null,
  id: null,
  historicSaldo: null
};
