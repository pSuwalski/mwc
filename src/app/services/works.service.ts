import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { emptyWorks, Works } from '../models/works';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';

let storedWorks: Works;

@Injectable()
export class WorksService {

  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  sections: Works[];
  cachedWorks: { [id: string]: Works[] } = {};

  constructor(
    private db: AngularFirestore
  ) {
  }

  storeWorks(works: Works) {
    storedWorks = works;
  }

  async restoreSection(): Promise<Works> {
    let returnWorks: Works;
    if (storedWorks !== null) {
      returnWorks = storedWorks;
    } else {
      returnWorks = null;
    }

    return returnWorks;
  }

  async addWorks(works: Works, unionId: string): Promise<any> {
    const id = this.db.createId();
    works.id = id;
    return this.db
      .collection('unions')
      .doc(`${unionId}`)
      .collection('works')
      .doc(id)
      .set(works);
  }

  async replaceWorks(section: Works, unionId: string): Promise<any> {
    if (await this.checkIfExists(`unions/${unionId}/works/${section.id}`)) {
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('works')
        .doc(section.id)
        .set(section);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async SearchWorksByProtocolNumber(unionId: string, protocolNumber: string): Promise<Works[]> {
    this.loadedFromBegining = 0;
    let companyIdRef;
    console.log(protocolNumber);
    if (!protocolNumber) {
      companyIdRef = await this.worksRef(unionId).ref.get();
    } else {
      companyIdRef = await this.worksRef(unionId).ref.
        where('protocolNumber', '==', protocolNumber)
        .limit(this.limit * 10).get();
    }
    const output: Works[] = [];
    if (!companyIdRef.empty) {

    console.log(companyIdRef);
      this.moreToBeLoadedIndicator = companyIdRef.docs.length === 30;
      this.loadedFromBegining = companyIdRef.docs.length;
      companyIdRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    return output;
  }

  parse(dbResolution: any): Works {
    const resolutionData: Works = this.parseFromInterface(dbResolution, emptyWorks());
    return resolutionData;
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }

  worksRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('works');
  }
}
