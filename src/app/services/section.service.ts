import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Section } from '../models/section';
import * as _ from 'lodash';

@Injectable()
export class SectionService {

  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  sections: Section[];

  constructor(
    private db: AngularFirestore
  ) {
  }

  async addSection(section: Section, unionId: string): Promise<any> {
    const id = this.db.createId();
    if (! await this.checkIfExists(`unions/${unionId}/sections/${id}`)) {
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('sections')
        .doc(id)
        .set(_.assign(section, { id }));
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanySections(unionId: string, companyId: string): Promise<Section[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.sectionsRef(unionId, companyId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Section);
    } else {
      return [];
    }
  }

  async loadMoreCompanySections(unionId: string, companyId: string) {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.sectionsRef(unionId, companyId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Section);
      } else {
        return [];
      }
    }
  }

  sectionsRef(unionId: string, companyId: string) {
    return this.db.collection('unions').doc(unionId).collection('sections');
  }
  sectionRef(unionId: string, companyId: string, sectionId: string) {
    return this.db.collection('unions').doc(unionId).collection('sections').doc(sectionId);
  }


}
