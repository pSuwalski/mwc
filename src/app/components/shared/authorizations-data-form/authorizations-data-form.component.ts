import { User } from '../../../models/user';
import { Component, OnInit, Input } from '@angular/core';
import { AuthData } from '../../../models/owner';

@Component({
  selector: 'mwc-authorizations-data-form',
  templateUrl: './authorizations-data-form.component.html',
  styleUrls: ['./authorizations-data-form.component.css']
})
export class AuthorizationsDataFormComponent implements OnInit {

  @Input() authDataForm: AuthData;
  @Input() editionDisabled = false;

  constructor() { }

  ngOnInit() {
  }

}

