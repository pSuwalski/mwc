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

  async addLeesee(leesee: Leesee, companyId: string): Promise<any> {
    if (! await this.checkIfExists(`companies/${companyId}/percels/${leesee.personalData.evidenceNumber.toString()}`)) {
      return this.db
        .collection('companies')
        .doc(companyId)
        .collection('leesees')
        .doc(leesee.personalData.evidenceNumber.toString())
        .set(leesee);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanyLeesees(companyId: string): Promise<Leesee[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.leeseesRef(companyId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Leesee);
    } else {
      return [];
    }
  }

  leeseeRef(companyId: string, leeseeId: string) {
    return this.db.collection('companies').doc(companyId).collection('percels').doc(leeseeId);
  }
  leeseesRef(companyId: string) {
    return this.db.collection('companies').doc(companyId).collection('leesees');
  }
}
