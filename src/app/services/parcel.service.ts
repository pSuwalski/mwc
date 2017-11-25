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
  parcels: Parcel[];


  constructor(
    private db: AngularFirestore
  ) {
  }

  async addPercel(percel: Parcel, unionId: string): Promise<any> {
    const id = this.db.createId();
    if (! await this.checkIfExists(`unions/${unionId}/percels/${id}`)) {
      return this.db
        .collection('unions')
        .doc(`${unionId}`)
        .collection('percels')
        .doc(id)
        .set(_.assign(percel, { id }));
    } else {
      return Promise.resolve(false);
    }
  }


  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanyParcels(unionId: string): Promise<Parcel[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.parcelsRef(unionId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Parcel);
    } else {
      return [];
    }
  }

  async loadMoreCompanyParcels(unionId: string) {
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
    return this.db.collection('unions').doc(unionId).collection('percels');
  }
  parcelRef(unionId: string, companyId: string, percelId: string) {
    return this.db.collection('unions').doc(unionId).collection('percels').doc(percelId);
  }


}
