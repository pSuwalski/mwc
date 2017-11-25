import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Resolution } from '../models/resolution';
import * as _ from 'lodash';

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

  async addResolution(resolution: Resolution, unionId: string): Promise<any> {
    if (! await this.checkIfExists(`unions/${unionId}/percels/${resolution.number.toString()}`)) {
      const id = this.db.createId();
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('resolutions')
        .doc(id)
        .set(_.assign(resolution, { id }));
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
      const parcelsRef = await this.resolutionsRef(unionId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Resolution);
      } else {
        return [];
      }
    }
  }

  resolutionsRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('resolutions');
  }
  resolutionRef(unionId: string, resolutionId: string) {
    return this.db.collection('unions').doc(unionId).collection('resolutions').doc(resolutionId);
  }

}
