import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Resolution } from '../models/resolution';

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

  async addResolution(resolution: Resolution, companyId: string): Promise<any> {
    if (! await this.checkIfExists(`companies/${companyId}/percels/${resolution.number.toString()}`)) {
      return this.db
        .collection('companies')
        .doc(companyId)
        .collection('resolutions')
        .doc(resolution.number.toString())
        .set(resolution);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanyResolutions(companyId: string): Promise<Resolution[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.resolutionsRef(companyId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Resolution);
    } else {
      return [];
    }
  }

  async loadMoreCompanyParcels(companyId: string) {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.resolutionsRef(companyId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Resolution);
      } else {
        return [];
      }
    }
  }

  resolutionsRef(companyId: string) {
    return this.db.collection('companies').doc(companyId).collection('resolutions');
  }
  resolutionRef(companyId: string, resolutionId: string) {
    return this.db.collection('companies').doc(companyId).collection('resolutions').doc(resolutionId);
  }

}
