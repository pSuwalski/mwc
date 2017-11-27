import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Parcel } from '../models/parcel';

import 'rxjs/add/operator/do';



@Injectable()
export class DatabaseService {

  constructor(
    private db: AngularFirestore
  ) {
  }


  async checkIfExists(document: AngularFirestoreDocument<any> ) {
    const dataRef = await document.ref.get();
    return dataRef.exists;
  }




}
