import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Resolution, emptyResolution } from '../models/resolution';
import * as _ from 'lodash';

let storedResolution: Resolution;

@Injectable()
export class ResolutionsService {

  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  resolutions: Resolution[];

  constructor(
    private db: AngularFirestore
  ) {
  }

  storeResolution(resolution: Resolution) {
    storedResolution = resolution;
  }

  async restoreResolution(): Promise<Resolution> {
    let returnResolution: Resolution;
    if (storedResolution !== null) {
      returnResolution = storedResolution;
    } else {
      returnResolution = null;
    }

    return returnResolution;
  }

  async addResolution(resolution: Resolution, unionId: string): Promise<any> {
    const id = this.db.createId();
    return this.db
      .collection('unions')
      .doc(unionId)
      .collection('resolutions')
      .doc(id)
      .set(_.assign(resolution, { id }));
  }

  async replaceResolution(resolution: Resolution, unionId: string): Promise<any> {
    if (await this.checkIfExists(`unions/${unionId}/resolutions/${resolution.id}`)) {
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('resolutions')
        .doc(resolution.id)
        .set(resolution);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanyResolutions(unionId: string, companyId: string): Promise<Resolution[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.resolutionsRef(unionId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Resolution);
    } else {
      return [];
    }
  }

  async loadMoreCompanyParcels(unionId: string) {
    if (this.moreToBeLoadedIndicator) {
      const resolutionsRef = await this.resolutionsRef(unionId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!resolutionsRef.empty) {
        this.moreToBeLoadedIndicator = resolutionsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + resolutionsRef.docs.length;
        return resolutionsRef.docs.map((p) => p.data() as Resolution);
      } else {
        return [];
      }
    }
  }

  async SearchResolutionByNumber(unionId: string, searchString: string): Promise<Resolution[]> {
    let resolutionNumberRef;
    if (!searchString) {
      resolutionNumberRef = await this.resolutionsRef(unionId).ref.get();
    } else {
      this.loadedFromBegining = 0;
      resolutionNumberRef = await this.resolutionsRef(unionId).ref.
        where('number', '==', searchString)
        .limit(this.limit * 10).get();
    }
    const output: Resolution[] = [];
    if (!resolutionNumberRef.empty) {
      this.moreToBeLoadedIndicator = resolutionNumberRef.docs.length === 30;
      this.loadedFromBegining = resolutionNumberRef.docs.length;
      resolutionNumberRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    return output;
  }

  parse(dbResolution: any): Resolution {
    const resolutionData: Resolution = this.parseFromInterface(dbResolution, emptyResolution());
    return resolutionData;
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }

  resolutionsRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('resolutions');
  }
  resolutionRef(unionId: string, resolutionId: string) {
    return this.db.collection('unions').doc(unionId).collection('resolutions').doc(resolutionId);
  }

}
