import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Parcel } from '../models/parcel';

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

  async addPercel(percel: Parcel, companyId: string): Promise<any> {
    if (! await this.checkIfExists(`companies/${companyId}/percels/${percel.number.toString()}`)) {
      return this.db
        .collection('companies')
        .doc(companyId)
        .collection('percels')
        .doc(percel.number.toString())
        .set(percel);
    } else {
      return Promise.resolve(false);
    }
  }

  // TODO dodawanie dzierzawcy addLessee -> this.db.doc(`companies/${companyId}`).collection('percels') i tak dalej

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanyParcels(companyId: string): Promise<Parcel[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.parcelsRef(companyId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Parcel);
    } else {
      return [];
    }
  }

  async loadMoreCompanyParcels(companyId: string) {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.parcelsRef(companyId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Parcel);
      } else {
        return [];
      }
    }
  }

  parcelsRef(companyId: string) {
    return this.db.collection('companies').doc(companyId).collection('percels');
  }
  parcelRef(companyId: string, percelId: string) {
    return this.db.collection('companies').doc(companyId).collection('percels').doc(percelId);
  }


}
