import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Parcel } from '../models/parcel';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';



@Injectable()
export class ParcelService {

  editedParcel: Parcel;
  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  cachedMultipleCompanyParcels: { [id: string]: Parcel[] } = {};
  cachedMultipleCompanySectionParcels: { [companyId: string]: { [sectionId: string]: Parcel[] } } = {};


  constructor(
    private db: AngularFirestore
  ) {
  }

  async addParcel(parcel: Parcel, unionId: string): Promise<any> {
    const id = this.db.createId();
    return this.db
      .collection('unions')
      .doc(`${unionId}`)
      .collection('parcels')
      .doc(id)
      .set(_.assign(parcel, { id }));

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

  async loadMoreUnionParcels(unionId: string) {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.parcelsRef(unionId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Parcel);
      } else {
        return [];
      }
    }
  }

  parcelsRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('parcels');
  }
  parcelRef(unionId: string, companyId: string, parcelId: string) {
    return this.db.collection('unions').doc(unionId).collection('parcels').doc(parcelId);
  }


}
