import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JoinApplication } from '../models/join-aplication';
import { GraphQlService } from './graphQl.service';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import { User } from '../models/user';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AngularFirestore } from 'angularfire2/firestore';
import { multicast } from 'rxjs/operator/multicast';





@Injectable()
export class UserService {

  currentUser: Observable<User>;

  constructor(
    private afa: AngularFireAuth,
    private af: AngularFirestore,
    private gqs: GraphQlService
  ) {
    this.currentUser = this.observeFirebaseUserId()
      // .distinctUntilChanged((a, b) => !b)
      .switchMap(async (uid) => (await af.collection('users').doc(uid).ref.get()).data())
  .do(/*console.log*/);
  }

  applyJoinApplication(joinApplication: JoinApplication): Promise<any> {
    const query = `mutation applyJoinApplication($user: InputUser!,
      $company: InputCompany!, $password: String!){
      applyJoinApplication(user: $user, company: $company, password: $password) }`;
    return this.gqs.createQuery(query, JSON.stringify(joinApplication)).toPromise();
  }

  async getJoinApplication(): Promise<JoinApplication[]> {
    const applicationsRef = await this.af.collection('joinApplications').ref.get();
    if (!applicationsRef.empty) {
      return applicationsRef.docs.map((ja) => ja.data() as JoinApplication);
    }else {
      return [];
    }
  }

  isUserLoggedIn(): Observable<any> {
    return this.afa.authState;
  }

  login(email: string, password: string) {
    return this.afa.auth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    this.afa.auth.signOut();
  }

  observeFirebaseUserId() {
    return Observable.create((observer) => {
      this.afa.auth.onAuthStateChanged(observer);
    })
      .map((authState?: { uid: string }) => authState ? authState.uid : null)
      .distinctUntilChanged();
  }

}
