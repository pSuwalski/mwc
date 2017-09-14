import { Component } from '@angular/core';

@Component({
  selector: 'mwc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private user: string;
  protected password: string;

}
