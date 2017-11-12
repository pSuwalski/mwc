import { User } from '../../../models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-authorizations-data-form',
  templateUrl: './authorizations-data-form.component.html',
  styleUrls: ['./authorizations-data-form.component.css']
})
export class AuthorizationsDataFormComponent implements OnInit {

  @Input() authDataForm: UserAuthData;

  constructor() { }

  ngOnInit() {
  }

}

export interface UserAuthData {
  nameSurname: string;
  pesel: number;
  phoneNumber: number;
  email: string;
  correspondenceAddress: string;
  authScope: string;
  validFrom: string;
  validTill: string;
}
