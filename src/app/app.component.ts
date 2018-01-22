import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { DateAdapter } from '@angular/material';
import { myParser } from './date-parser';


@Component({
  selector: 'mwc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private us: UserService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('pl');
    this.dateAdapter.parse = myParser;
  }
}
