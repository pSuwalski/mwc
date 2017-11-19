import { Component } from '@angular/core';
import { UserService } from './services/user.service';


@Component({
  selector: 'mwc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private us: UserService
  ) {
  }
}
