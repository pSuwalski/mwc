import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JoinApplication } from '../models/join-aplication';
import { GraphQlService } from './graphQl.service';

import 'rxjs/add/operator/toPromise';



@Injectable()
export class UserService {
  constructor(
    private afa: AngularFireAuth,
    private gqs: GraphQlService
  ) {
  }

  applyJoinApplication(joinApplication: JoinApplication): Promise<any> {
    const query = `mutation applyJoinApplication($user: InputUser!,
      $company: InputCompany!, $password: String!){
      applyJoinApplication(user: $user, company: $company, password: $password) }`;
    return this.gqs.createQuery(query, JSON.stringify(joinApplication)).toPromise();
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

}
