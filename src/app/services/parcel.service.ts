import { emptyParcelData } from '../models/owner';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Parcel, emptyParcel } from '../models/parcel';
import { firestore } from 'firebase/app';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';
import { capitalizeStrings } from '../helper-functions';

let storedParcel: Parcel;

@Injectable()
export class ParcelService {

  lastQuery: firestore.Query;
  editedParcel: Parcel;
  limit = 1;
  loadedFromBegining = 0;
  parcels: Parcel[] = [];
  moreToBeLoadedIndicator = false;
  cachedMultipleCompanyParcels: { [id: string]: Parcel[] } = {};
  cachedMultipleCompanySectionParcels: { [companyId: string]: { [sectionId: string]: Parcel[] } } = {};


  constructor(
    private db: AngularFirestore
  ) {
  }

  storeParcel(parcel: Parcel) {
    storedParcel = parcel;
  }

  async restoreParcel(): Promise<Parcel> {
    let returnParcel: Parcel;
    if (storedParcel !== null) {
      returnParcel = storedParcel;
    } else {
      returnParcel = null;
    }

    return returnParcel;
  }

  async addParcel(parcel: Parcel, unionId: string): Promise<any> {
    const id = this.db.createId();
    return this.db
      .collection('unions')
      .doc(`${unionId}`)
      .collection('parcels')
      .doc(id)
      .set(capitalizeStrings(_.assign(parcel, { id })));

  }

  async replaceParcel(parcel: Parcel, unionId: string): Promise<any> {
    if (await this.checkIfExists(`unions/${unionId}/parcels/${parcel.id}`)) {
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('parcels')
        .doc(parcel.id)
        .set(capitalizeStrings(parcel));
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getSectionParcels(unionId: string, companyId: string, sectionId: string, limit?: boolean): Promise<Parcel[]> {
    if (!this.cachedMultipleCompanySectionParcels[companyId] || !this.cachedMultipleCompanySectionParcels[companyId][sectionId]) {
      const parcelsRef = await this.parcelsRef(unionId).ref
        .where('companyId', '==', companyId)
        .where('sectionId', '==', sectionId)
        .limit(limit ? this.limit : 100000)
        .get();
      if (!parcelsRef.empty) {
        this.cachedMultipleCompanySectionParcels[companyId] = { [sectionId]: parcelsRef.docs.map((p) => p.data() as Parcel) };
        return this.cachedMultipleCompanySectionParcels[companyId][sectionId];
      } else {
        return [];
      }
    } else {
      return this.cachedMultipleCompanySectionParcels[companyId][sectionId];
    }
  }

  async getSectionParcelsByCity(unionId: string, companyId: string, sectionId: string,
    citySearch: string, limit?: boolean): Promise<Parcel[]> {

    this.loadedFromBegining = 0;
    let parcelNameRef;
    let parcelNameRefUpperCase;
    console.log(unionId, companyId, name);
    if (!citySearch) {
      this.lastQuery = await this.parcelsRef(unionId).ref
      .where('companyId', '==', companyId)
      .where('sectionId', '==', sectionId)
      .limit(limit ? this.limit : 100000);
      parcelNameRef = await this.lastQuery.orderBy('number', 'asc').limit(this.limit).get();
    } else {
      this.lastQuery = await this.parcelsRef(unionId).ref
      .where('companyId', '==', companyId)
      .where('sectionId', '==', sectionId)
      .where('cityId', '>=', _.capitalize(citySearch))
      .where('cityId', '<=', _.capitalize(citySearch) + String.fromCharCode(1000))
      .limit(limit ? this.limit : 100000);
      parcelNameRefUpperCase = await this.lastQuery.orderBy('cityId', 'asc').limit(this.limit).get();
    }
    const output: Parcel[] = [];
    if (parcelNameRef && !parcelNameRef.empty) {
      this.moreToBeLoadedIndicator = parcelNameRef.docs.length === this.limit;
      this.loadedFromBegining = parcelNameRef.docs.length;
      parcelNameRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    if (parcelNameRefUpperCase && !parcelNameRefUpperCase.empty) {
      this.moreToBeLoadedIndicator = parcelNameRefUpperCase.docs.length === this.limit * 10;
      this.loadedFromBegining = parcelNameRefUpperCase.docs.length;
      parcelNameRefUpperCase.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    this.parcels = output;
    return output;
  }

  async getSectionParcelsByNumber(unionId: string, companyId: string, sectionId: string,
    numberSearch: string, limit?: boolean): Promise<Parcel[]> {

    this.loadedFromBegining = 0;
    let parcelNameRef;
    let parcelNameRefUpperCase;
    console.log(unionId, companyId, name);
    if (!numberSearch) {
      this.lastQuery = await this.parcelsRef(unionId).ref
      .where('companyId', '==', companyId)
      .where('sectionId', '==', sectionId)
      .limit(limit ? this.limit : 100000);
      parcelNameRef = await this.lastQuery.orderBy('number', 'asc').limit(this.limit).get();
    } else {
      console.log(numberSearch);
      this.lastQuery = await this.parcelsRef(unionId).ref
      .where('companyId', '==', companyId)
      .where('sectionId', '==', sectionId)
      .where('number', '==', numberSearch)
      .limit(limit ? this.limit : 100000);
      parcelNameRefUpperCase = await this.lastQuery.get();
    }
    const output: Parcel[] = [];
    if (parcelNameRef && !parcelNameRef.empty) {
      this.moreToBeLoadedIndicator = parcelNameRef.docs.length === this.limit;
      this.loadedFromBegining = parcelNameRef.docs.length;
      parcelNameRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    if (parcelNameRefUpperCase && !parcelNameRefUpperCase.empty) {
      this.moreToBeLoadedIndicator = parcelNameRefUpperCase.docs.length === this.limit * 10;
      this.loadedFromBegining = parcelNameRefUpperCase.docs.length;
      parcelNameRefUpperCase.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    this.parcels = output;
    return output;
  }

  async SearchParcelByNumber(unionId: string, searchString: string): Promise<Parcel[]> {
    let parcelNumberRef;
    if (!searchString) {
      parcelNumberRef = await this.parcelsRef(unionId).ref.get();
    } else {
      this.loadedFromBegining = 0;
      parcelNumberRef = await this.parcelsRef(unionId).ref
        .where('number', '>=', searchString)
        .where('number', '<=', searchString + String.fromCharCode(1000))
        .limit(this.limit)
        .get();
    }
    const output: Parcel[] = [];
    if (!parcelNumberRef.empty) {
      this.moreToBeLoadedIndicator = parcelNumberRef.docs.length === 30;
      this.loadedFromBegining = parcelNumberRef.docs.length;
      parcelNumberRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    this.parcels = output;
    return this.parcels;
  }

  async getCompanyParcels(unionId: string, companyId: string, limit?: boolean): Promise<Parcel[]> {
    this.loadedFromBegining = 0;
    if (!this.cachedMultipleCompanyParcels[companyId]) {
      const parcelsRef = await this.parcelsRef(unionId).ref.where('companyId', '==', companyId).limit(limit ? this.limit : 100000).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = limit ? parcelsRef.docs.length === 30 : false;
        this.loadedFromBegining = parcelsRef.docs.length;
        this.cachedMultipleCompanyParcels[companyId] = parcelsRef.docs.map((p) => p.data() as Parcel);
        return this.cachedMultipleCompanyParcels[companyId];
      } else {
        return [];
      }
    } else {
      return this.cachedMultipleCompanyParcels[companyId];
    }
  }


  async getUnionParcels(unionId: string, limit?: boolean): Promise<Parcel[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.parcelsRef(unionId).ref.limit(limit ? this.limit : 100000).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Parcel);
    } else {
      return [];
    }
  }

  async loadMoreByNumber() {
    if (this.moreToBeLoadedIndicator) {
      const sectionsRef = await this.lastQuery
        .orderBy('name', 'asc')
        .startAfter(this.parcels[this.loadedFromBegining - 1].number)
        .limit(this.limit)
        .get();
      if (!sectionsRef.empty) {
        this.moreToBeLoadedIndicator = sectionsRef.docs.length === this.limit;
        this.loadedFromBegining = this.loadedFromBegining + sectionsRef.docs.length;
        sectionsRef.docs.forEach((p) => this.parcels.push(p.data() as Parcel));
      } else {
        return [];
      }
    }
  }

  async loadMoreByCity() {
    if (this.moreToBeLoadedIndicator) {
      console.log(this.parcels);
      console.log(this.loadedFromBegining);
      const sectionsRef = await this.lastQuery
        .orderBy('name', 'asc')
        .startAfter(this.parcels[this.loadedFromBegining - 1].cityId)
        .limit(this.limit)
        .get();
      if (!sectionsRef.empty) {
        this.moreToBeLoadedIndicator = sectionsRef.docs.length === this.limit;
        this.loadedFromBegining = this.loadedFromBegining + sectionsRef.docs.length;
        sectionsRef.docs.forEach((p) => this.parcels.push(p.data() as Parcel));
      } else {
        return [];
      }
    }
  }

  parse(dbParcel: any): Parcel {
    const parcelData: Parcel = this.parseFromInterface(dbParcel, emptyParcel());
    return parcelData;
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }


  parcelsRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('parcels');
  }
  parcelRef(unionId: string, companyId: string, parcelId: string) {
    return this.db.collection('unions').doc(unionId).collection('parcels').doc(parcelId);
  }

}


