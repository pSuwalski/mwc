import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Leesee } from '../models/leesee';

import 'rxjs/add/operator/do';

@Injectable()
export class LeeseeService {

  editedLeesee: Leesee;
  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  parcels: Leesee[];

  constructor(
    private db: AngularFirestore
  ) { }

  async addLeesee(leesee: Leesee): Promise<any> {
    if (! await this.checkIfExists(`leesee/${leesee.personalData.evidenceNumber}`)) {
      return this.db
        .collection('leesee')
        .doc(String(leesee.personalData.evidenceNumber))
        .set(leesee);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getLeesees(): Promise<Leesee[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.leeseesRef().ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Leesee);
    } else {
      return [];
    }
  }

  leeseeRef(evidenceNumber: string) {
    return this.db.collection('leesee').doc(evidenceNumber);
  }
  leeseesRef() {
    return this.db.collection('leesee');
  }

}
