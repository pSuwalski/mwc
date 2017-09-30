import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mwc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @HostBinding('class.floated-container') containerClass = 'floated-container';
  @HostBinding('class.single-toolbar-container') toolbarClass = 'floated-container';

  constructor(
    public router: Router
  ) {
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
