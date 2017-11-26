import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JoinApplication } from '../models/join-aplication';
import { GraphQlService } from './graphQl.service';
import * as firebase from 'firebase';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import { User } from '../models/user';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AngularFirestore } from 'angularfire2/firestore';
import { multicast } from 'rxjs/operator/multicast';
import { FirestoreUnion, Union, Company } from '../models/company';
import { sanitizeNip } from '../models/company';
import { observeOn } from 'rxjs/operator/observeOn';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';





@Injectable()
export class UserService {

  currentUser: ConnectableObservable<User>;

  constructor(
    private afa: AngularFireAuth,
    private af: AngularFirestore,
    private gqs: GraphQlService
  ) {
    this.currentUser = this.observeFirebaseUserId()
      .switchMap(async (uid) => (await af.collection('users').doc(uid).ref.get()).data())
      .switchMap(async (user: User) => {
        const union = (await af.collection('unions').doc(user.unionId).ref.get()).data() as Union;
        const companies = [];
        const companiesRef = (await af.collection('unions').doc(user.unionId).collection('comapnies').ref.get());
        companiesRef.docs.forEach((doc) => {
          if (doc.exists) {
            companies.push(doc.data() as Company);
          }
        });
        user.companies = companies;
        return user;
      })
      .multicast(new ReplaySubject<User>(1));
    this.currentUser.connect();
  }

  applyJoinApplication(joinApplication: JoinApplication): Promise<any> {
    const query = `mutation applyJoinApplication($user: InputUser!,
      $union: InputUnion!, $password: String!){
      applyJoinApplication(user: $user, union: $union, password: $password) }`;
    return this.gqs.createQuery(query, JSON.stringify(joinApplication)).toPromise();
  }

  acceptJoinAppliction(nip: string) {
    const query = `mutation {
      acceptJoinApplication(unionId: "${sanitizeNip(nip)}")
    }`;
    return this.gqs.createQuery(query, JSON.stringify({})).toPromise();
  }

  async getJoinApplications(): Promise<JoinApplication[]> {
    const applicationsRef = await this.af.collection('joinApplications').ref.get();
    if (!applicationsRef.empty) {
      return applicationsRef.docs.map((ja) => ja.data() as JoinApplication);
    } else {
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

  observeFirebaseUserId(): BehaviorSubject<string> {
    return Observable.create((observer) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          observer.next(user.uid);
        }
      });
    });
  }

  rejectJoinAppliction(nip: string) {
    const query = `mutation {
      rejectJoinApplication(unionId: "${sanitizeNip(nip)}")
    }`;
    return this.gqs.createQuery(query, JSON.stringify({})).toPromise();
  }

}
