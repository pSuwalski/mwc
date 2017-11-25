import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Parcel } from '../models/parcel';

import 'rxjs/add/operator/do';



@Injectable()
export class DatabaseService {

  parcelsRef(companyId: string) {
    return this.db.collection('unions').doc(companyId).collection('percels');
  }
  parcelRef(companyId: string, percelId: string) {
    return this.db.collection('unions').doc(companyId).collection('percels').doc(percelId);
  }

  constructor(
    private db: AngularFirestore
  ) {
  }

  async addPercel(percel: Parcel, unionId: string, companyId: string): Promise<any> {
    if (! await this.checkIfExists(this.parcelRef(companyId, percel.number.toString()))) {
      return this.db
        .doc(`unions/${unionId}/comapnies/${companyId}`)
        .collection('percels')
        .doc(percel.number.toString())
        .set(percel);
    } else {
      return Promise.resolve('error');
    }
  }

  // TODO dodawanie dzierzawcy addLessee -> this.db.doc(`companies/${companyId}`).collection('percels') i tak dalej

  async checkIfExists(document: AngularFirestoreDocument<any> ) {
    const dataRef = await document.ref.get();
    return dataRef.exists;
  }




}
