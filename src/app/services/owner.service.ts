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
} from '../models/owner';
import * as hf from '../helper-functions';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';

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

  async restoreOwner(unionId: string, id: string): Promise<Owner> {
    if (storedOwner.id === id) {
      return storedOwner;
    } else {
      const ownerRef = await this.ownerRef(unionId).doc(id).ref.get();
      if (ownerRef.exists) {
        return this.parse(ownerRef.data());
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
    const dbOwner = _.assign(address, { id },
      owner.contactData, personalData.personalData, {
        historicSaldo: owner.historicSaldo, authData: owner.authData, parcelsData: owner.parcelsData
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
          historicSaldo: owner.historicSaldo, authData: owner.authData, parcelsData: owner.parcelsData
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
    const leeseesRef = await this.ownerRef(unionId).ref.limit(this.limit).get();
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
    const ownerSurnameRef = surname.length > 0 ? await this.ownerRef(unionId).ref.
      where('surname', '>=', surname)
      .where('surname', '<=', surname + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const ownerNameRef = name.length > 0 ? await this.ownerRef(unionId).ref
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
      ownerEvidenceNumberRef = await this.ownerRef(unionId).ref.get();
    } else {
      this.loadedFromBegining = 0;
      ownerEvidenceNumberRef = await this.ownerRef(unionId).ref
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
    const leeseesStreetRef = street.length > 0 ? await this.ownerRef(unionId).ref
      .orderBy('streetAndNumber')
      .where('streetAndNumber', '>=', street)
      .where('streetAndNumber', '<=', street + String.fromCharCode(1000))
      .limit(this.limit * 10).get() : null;
    const ownerCityRef = city.length > 0 ? await this.ownerRef(unionId).ref
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


  parse(dbOwner: any): Owner {
    const personalData: PersonalData = this.parsePersonalData(dbOwner);
    const contactData = this.parseFromInterface(dbOwner, emptyOwnerContact());
    const authData = [];
    const historicSaldo = dbOwner.historicSaldo;
    const saldo = dbOwner.saldo;
    const parcelsData = [];
    if (dbOwner.authData) {
      dbOwner.authData.forEach((ad) => authData.push(this.parseFromInterface(ad, emptyOwnerAuth())));
    }
    if (dbOwner.parcelsData) {
      dbOwner.parcelsData.forEach((pd) => {
        parcelsData.push(this.parseFromInterface(pd, emptyParcelDataFull()));
      });
    }
    return { personalData, contactData, authData, id: dbOwner.id, historicSaldo, saldo, parcelsData: parcelsData };
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


  ownerRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('owners');
  }
}



