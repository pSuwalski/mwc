import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class UserService {
  constructor(
    private afa: AngularFireAuth
  ) {
  }

  isUserLoggedIn(): Observable<any> {
    return this.afa.authState;
  }

  logOut() {
    this.afa.auth.signOut();
  }

}
