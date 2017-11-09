import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'mwc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public user: string;
  protected password: string;

  constructor(
    public router: Router,
    public us: UserService
  ) {
    // this.user = 'test@gmail.com';
    // this.password = 'testowehaslo';
    // this.login();
  }
  login() {
    this.us.login(this.user, this.password).then(() => {
      this.router.navigate(['/']);
    }).catch((error) => {
      console.log('unsuccessful login');
      alert(error.message);
    });
  }

}
