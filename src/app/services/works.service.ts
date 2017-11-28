import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Works } from '../models/works';
import * as _ from 'lodash';

import 'rxjs/add/operator/do';



@Injectable()
export class WorksService {


  constructor(
    private db: AngularFirestore
  ) {
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

}
