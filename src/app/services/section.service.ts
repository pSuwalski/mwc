import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Section, emptySection } from '../models/section';
import * as _ from 'lodash';
import { firestore } from 'firebase/app';

let storedSection: Section;

@Injectable()
export class SectionService {
  searchString: any;
  unionId: any;

  lastQuery: firestore.Query;
  limit = 20;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = false;
  sections: Section[] = [];
  cachedCompanySections: { [id: string]: Section[] } = {};
  selectedCompanyId: string;

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
    if (await this.checkIfExists(`unions/${unionId}/sections/${section.id}`)) {
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

  selectCompany(id: string) {
    console.log(id, this.selectedCompanyId);
    if (id !== this.selectedCompanyId) {
      this.sections = [];
      this.selectedCompanyId = id;
      this.SearchSectionsByName(this.unionId, this.selectedCompanyId, this.searchString);
    }
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

  async loadMore() {
    if (this.moreToBeLoadedIndicator) {
      const sectionsRef = await this.lastQuery
        .orderBy('name', 'asc')
        .startAfter(this.sections[this.loadedFromBegining - 1].name)
        .limit(this.limit)
        .get();
      if (!sectionsRef.empty) {
        this.moreToBeLoadedIndicator = sectionsRef.docs.length === this.limit;
        this.loadedFromBegining = this.loadedFromBegining + sectionsRef.docs.length;
        sectionsRef.docs.forEach((p) => this.sections.push(p.data() as Section));
      } else {
        return [];
      }
    }
  }

  async SearchSectionsByName(unionId: string, companyId: string, name: string): Promise<any> {
    this.loadedFromBegining = 0;
    let sectionNameRef;
    let sectionNameRefUpperCase;
    console.log(unionId, companyId, name);
    if (!name) {
      this.lastQuery = this.companySectionsRef(unionId, companyId);
      sectionNameRef = await this.lastQuery.orderBy('name', 'asc').limit(this.limit).get();
    } else {
      this.lastQuery = this.companySectionsRef(unionId, companyId)
        .where('name', '>=', _.capitalize(name))
        .where('name', '<=', _.capitalize(name) + String.fromCharCode(1000));
      sectionNameRefUpperCase = await this.lastQuery.orderBy('name', 'asc').limit(this.limit).get();
    }
    const output: Section[] = [];
    if (sectionNameRef && !sectionNameRef.empty) {
      this.moreToBeLoadedIndicator = sectionNameRef.docs.length === this.limit;
      this.loadedFromBegining = sectionNameRef.docs.length;
      sectionNameRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    if (sectionNameRefUpperCase && !sectionNameRefUpperCase.empty) {
      this.moreToBeLoadedIndicator = sectionNameRefUpperCase.docs.length === this.limit * 10;
      this.loadedFromBegining = sectionNameRefUpperCase.docs.length;
      sectionNameRefUpperCase.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    this.sections = output;
    return 'ok';
  }

  async SearchSectionById(unionId: string, id: string): Promise<Section[]> {
    this.loadedFromBegining = 0;
    let companyIdRef;
    if (!id) {
      companyIdRef = await this.sectionsRef(unionId).ref.get();
    } else {
      companyIdRef = await this.sectionsRef(unionId).ref.
        where('id', '==', id)
        .limit(this.limit * 10).get();
    }
    const output: Section[] = [];
    if (!companyIdRef.empty) {
      this.moreToBeLoadedIndicator = companyIdRef.docs.length === 30;
      this.loadedFromBegining = companyIdRef.docs.length;
      companyIdRef.docs.forEach((p) => output.push(this.parse(p.data())));
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
  companySectionsRef(unionId: string, companyId: string) {
    return this.db.collection('unions').doc(unionId).collection('sections').ref.where('companyId', '==', companyId);
  }


}
