import { OwnerService } from '../../../services/owner.service';
import { Component, OnInit } from '@angular/core';
import { Owner, emptyOwnerContact, emptyOwnerPersonal, emptySaldo, emptyParcelDataFull } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'mwc-owner-output-data-form',
  templateUrl: './owner-output-data-form.component.html',
  styleUrls: ['./owner-output-data-form.component.css']
})
export class OwnerOutputDataFormComponent implements OnInit {

  // owner: Owner;
  ownerTemp: Owner;
  currentUser: User;
  subsriptions: Subscription[] = [];
  editionDisabled = true;
  progressBar: boolean;
  addedSuccessfully: string;

  owner: Owner = {
    personalData: emptyOwnerPersonal(),
    contactData: emptyOwnerContact(),
    authData: [],
    id: null,
    historicSaldo: emptySaldo(),
    parcelsData: []
  };

  constructor(
    private router: Router,
    private os: OwnerService,
    private us: UserService,
  ) {
    this.os.restoreOwner().then(own => {
      if (own !== null) {
        this.owner = own;
        this.subsriptions.push(
          this.us.currentUser.subscribe((cu) => {
            this.currentUser = cu;
          })
        );
      }
    });
   }

  ngOnInit() {
  }

  addAuth() {
    if (this.owner.authData === undefined) {
      this.owner.authData = [];
    }
    this.owner.authData.push(
      {
        authScope: null, correspondenceAddress: null, email: null, nameSurname: null, pesel: null,
        phoneNumber: null, validFrom: null, validTill: null
      }
    );
  }

  addParcel() {
    if (this.owner.parcelsData === undefined) {
      this.owner.parcelsData = [];
    }
    this.owner.parcelsData.push(emptyParcelDataFull());
  }

  removeAuth() {
    this.owner.authData.pop();
  }

  removeParcel() {
    this.owner.parcelsData.pop();
  }


  save() {
    this.progressBar = true;
    this.editionDisabled = true;
    this.os.replaceOwner(this.owner, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  cancel() {
    this.owner = _.cloneDeep(this.ownerTemp);
    this.editionDisabled = true;
  }


  edit() {
    this.ownerTemp = _.cloneDeep(this.owner);
    this.editionDisabled = false;
  }

  goBack() {
    this.router.navigate(['/search/leesee']);
  }

}
