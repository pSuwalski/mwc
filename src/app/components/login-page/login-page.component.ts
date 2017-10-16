import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'mwc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public user: string;
  protected password: string;
  private firebase: FirebaseApp;

  constructor(
    @Inject(FirebaseApp) firebaseApp: any,
    public router: Router
  ) {
    this.firebase = firebaseApp;
    // const email = 'test@gmail.com';
    // const password = 'testowehaslo';
    // firebaseApp.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    //   // Handle Errors here.
    //   console.log(error.code);
    //   console.log(error.message);
    //   // ...
    // });
  }
  login() {
    const self = this;
    this.firebase.auth().signInWithEmailAndPassword(this.user, this.password).then(function () {
      self.router.navigate(['/']);
    }).catch(function (error) {
      console.log('unsuccessful login');
      alert(error.message);
    });
  }

}
