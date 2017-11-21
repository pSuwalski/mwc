import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Section } from '../models/section';

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

  async addSection(section: Section, companyId: string): Promise<any> {
    if (! await this.checkIfExists(`companies/${companyId}/sections/${section.evidenceNumber}`)) {
      return this.db
        .collection('companies')
        .doc(companyId)
        .collection('sections')
        .doc(section.evidenceNumber.toString())
        .set(section);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async getCompanySections(companyId: string): Promise<Section[]> {
    this.loadedFromBegining = 0;
    const parcelsRef = await this.sectionsRef(companyId).ref.limit(this.limit).get();
    if (!parcelsRef.empty) {
      this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
      this.loadedFromBegining = parcelsRef.docs.length;
      return parcelsRef.docs.map((p) => p.data() as Section);
    } else {
      return [];
    }
  }

  async loadMoreCompanySections(companyId: string) {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.sectionsRef(companyId).ref.startAfter(this.loadedFromBegining).limit(this.limit).get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Section);
      } else {
        return [];
      }
    }
  }

  sectionsRef(companyId: string) {
    return this.db.collection('companies').doc(companyId).collection('sections');
  }
  sectionRef(companyId: string, sectionId: string) {
    return this.db.collection('companies').doc(companyId).collection('sections').doc(sectionId);
  }


}
