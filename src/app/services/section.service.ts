import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Section, emptySection } from '../models/section';
import * as _ from 'lodash';

let storedSection: Section;

@Injectable()
export class SectionService {

  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;
  sections: Section[];
  cachedCompanySections: { [id: string]: Section[] } = {};

  constructor(
    private db: AngularFirestore
  ) {
  }

  storeSection(section: Section) {
    storedSection = section;
  }

  async restoreSection(): Promise<Section> {
    let returnSection: Section;
    if (storedSection !== null) {
      returnSection = storedSection;
    } else {
      returnSection = null;
    }

    return returnSection;
  }

  async addSection(section: Section, unionId: string): Promise<any> {
    const id = this.db.createId();
    if (! await this.checkIfExists(`unions/${unionId}/sections/${id}`)) {
      section.id = id;
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('sections')
        .doc(id)
        .set(section);
    } else {
      return Promise.resolve(false);
    }
  }

  async replaceSection(section: Section, unionId: string): Promise<any> {
    // const id = this.db.createId();
    if (await this.checkIfExists(`unions/${unionId}/sections/${section.id}`)) {
      // section.id = id;
      return this.db
        .collection('unions')
        .doc(unionId)
        .collection('sections')
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

  async getCompanySections(unionId: string, companyId: string): Promise<Section[]> {
    // TODO: PiechotM reconsider
    if (null == companyId || undefined === companyId) {
      return;
    }

    if (!this.cachedCompanySections[companyId]) {
      const parcelsRef = await this.sectionsRef(unionId).ref
        .where('companyId', '==', companyId)
        .limit(this.limit)
        .get();
      if (!parcelsRef.empty) {
        this.cachedCompanySections[companyId] = parcelsRef.docs.map((p) => p.data() as Section);
        return this.cachedCompanySections[companyId];
      } else {
        return [];
      }
    } else {
      return this.cachedCompanySections[companyId];
    }
  }

  async loadMoreCompanySections(unionId: string, companyId: string) {
    if (this.moreToBeLoadedIndicator) {
      const parcelsRef = await this.sectionsRef(unionId).ref
        .where('companyId', '==', companyId)
        .startAfter(this.loadedFromBegining)
        .limit(this.limit)
        .get();
      if (!parcelsRef.empty) {
        this.moreToBeLoadedIndicator = parcelsRef.docs.length === 30;
        this.loadedFromBegining = this.loadedFromBegining + parcelsRef.docs.length;
        return parcelsRef.docs.map((p) => p.data() as Section);
      } else {
        return [];
      }
    }
  }

  async SearchSectionsByName(unionId: string, name: string): Promise<Section[]> {
    this.loadedFromBegining = 0;
    let sectionNameRef;
    if (!name) {
      sectionNameRef = await this.sectionsRef(unionId).ref.get();
    } else {
      sectionNameRef = await this.sectionsRef(unionId).ref.
        where('name', '>=', name).where('name', '<=', name + String.fromCharCode(1000))
        .limit(this.limit * 10).get();
    }
    const output: Section[] = [];
    if (!sectionNameRef.empty) {
      this.moreToBeLoadedIndicator = sectionNameRef.docs.length === 30;
      this.loadedFromBegining = sectionNameRef.docs.length;
      sectionNameRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    return output;
  }

  parse(dbResolution: any): Section {
    const resolutionData: Section = this.parseFromInterface(dbResolution, emptySection());
    return resolutionData;
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }

  sectionsRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('sections');
  }
  sectionRef(unionId: string, companyId: string, sectionId: string) {
    return this.db.collection('unions').doc(unionId).collection('sections').doc(sectionId);
  }


}
