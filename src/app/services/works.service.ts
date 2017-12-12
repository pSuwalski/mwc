import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { emptyWorks, Works } from '../models/works';
import * as _ from 'lodash';
import { firestore } from 'firebase/app';

import 'rxjs/add/operator/do';
import { capitalizeStrings } from '../helper-functions';

let storedWorks: Works;

@Injectable()
export class WorksService {

  limit = 1;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = false;
  works: Works[];
  cachedWorks: { [id: string]: Works[] } = {};
  lastQuery: firestore.Query;

  constructor(
    private db: AngularFirestore
  ) {
  }

  storeWorks(works: Works) {
    storedWorks = works;
  }

  async restoreWorks(unionId: string, id: string): Promise<Works> {
    if (storedWorks.id === id) {
      return storedWorks;
    } else {
      const worksRef = await this.worksRef(unionId).doc(id).ref.get();
      if (worksRef.exists) {
        return this.parse(worksRef.data());
      } else {
        return null;
      }
    }
  }

  async addWorks(works: Works, unionId: string): Promise<any> {
    const id = this.db.createId();
    works.id = id;
    return this.db
      .collection('unions')
      .doc(`${unionId}`)
      .collection('works')
      .doc(id)
      .set(capitalizeStrings(works));
  }

  async replaceWorks(section: Works, unionId: string): Promise<any> {
    if (await this.checkIfExists(`unions/${unionId}/works/${section.id}`)) {
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('works')
        .doc(section.id)
        .set(capitalizeStrings(section));
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
    let worksRef;
    if (!protocolNumber) {
      this.lastQuery = await this.worksRef(unionId).ref
      .limit(this.limit);
      worksRef = await this.lastQuery.orderBy('protocolNumber', 'asc').limit(this.limit).get();
    } else {
      this.lastQuery = await this.worksRef(unionId).ref.
      where('protocolNumber', '==', protocolNumber)
      .limit(this.limit);
      worksRef = await this.lastQuery.orderBy('protocolNumber', 'asc').limit(this.limit).get();
    }
    const output: Works[] = [];
    if (!worksRef.empty) {
      this.moreToBeLoadedIndicator = worksRef.docs.length === this.limit;
      this.loadedFromBegining = worksRef.docs.length;
      worksRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    this.works = output;
    return output;
  }

  async loadMoreByNumber(): Promise<Works[]> {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.lastQuery
        .orderBy('protocolNumber', 'asc')
        .startAfter(this.works[this.loadedFromBegining - 1].protocolNumber)
        .limit(this.limit)
        .get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === this.limit;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        parcelsRef.docs.forEach((p) => this.works.push(p.data() as Works));
        return this.works;
      } else {
        return [];
      }
    }
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
