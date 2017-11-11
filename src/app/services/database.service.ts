import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';



@Injectable()
export class DatabaseService {
  constructor(
    private db: AngularFirestore
  ) {
  }

  addData(data: any, path: string): Promise<any> {
    const id: string = this.db.createId();
    if (!this.checkIfExists) {
      return this.db.doc(`${path}/${id}`).set(data);
    } else {
      return Promise.resolve(false);
    }
  }

  async checkIfExists(path: string) {
    const dataRef = await this.db.doc(path).ref.get();
    return dataRef.exists;
  }


}
