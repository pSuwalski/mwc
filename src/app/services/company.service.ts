import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Company, emptyCompany } from '../models/company';
import * as _ from 'lodash';

@Injectable()
export class CompanyService {

  limit = 30;
  loadedFromBegining = 0;
  moreToBeLoadedIndicator = true;

  constructor(
    private db: AngularFirestore
  ) {
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }

  async SearchCompanyById(unionId: string, id: string): Promise<Company[]> {
    this.loadedFromBegining = 0;
    let companyIdRef;
    if (!id) {
      companyIdRef = await this.companiesRef(unionId).ref.get();
    } else {
      companyIdRef = await this.companiesRef(unionId).ref.
        where('id', '==', id)
        .limit(this.limit * 10).get();
    }
    const output: Company[] = [];
    if (!companyIdRef.empty) {
      this.moreToBeLoadedIndicator = companyIdRef.docs.length === 30;
      this.loadedFromBegining = companyIdRef.docs.length;
      companyIdRef.docs.forEach((p) => output.push(this.parse(p.data())));
    }
    return output;
  }

  parse(dbResolution: any): Company {
    const resolutionData: Company = this.parseFromInterface(dbResolution, emptyCompany());
    return resolutionData;
  }

  parseFromInterface<T>(parsed: any, emptyParsedType: T): T {
    return _.reduce(_.keys(emptyParsedType), (object, key) => {
      return _.assign(object, { [key]: parsed[key] });
    }, {});
  }

  companiesRef(unionId: string) {
    return this.db.collection('unions').doc(unionId).collection('companies');
  }
}
