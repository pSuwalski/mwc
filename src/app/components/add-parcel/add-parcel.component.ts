
import { calcBindingFlags } from '@angular/core/src/view/util';
import { Component, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Parcel, emptyParcel } from '../../models/parcel';
import { UserService } from '../../services/user.service';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../models/user';

import 'rxjs/add/operator/mergeMap';
import { ParcelService } from '../../services/parcel.service';

@Component({
  selector: 'mwc-add-parcel',
  templateUrl: './add-parcel.component.html',
  styleUrls: ['./add-parcel.component.css']
})
export class AddParcelComponent implements OnDestroy {

  addingResult: string;
  companyId: string;
  currentUser: User;
  progressBar: boolean;
  subscriptions: Subscription[] = [];

  parcel: Parcel = emptyParcel();

  constructor(
    private ps: ParcelService,
    private us: UserService
  ) {
    this.progressBar = true;
    this.subscriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.progressBar = false;
      })
    );
  }


  add() {
    this.progressBar = true;
    this.ps.addParcel(this.parcel, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addingResult = 'success';
        this.parcel = emptyParcel();
        this.companyId = null;
      })
      .catch((e) => console.log(e));
  }

  changeCompanyId() {
    setTimeout(() =>
      this.companyId = this.parcel.companyId
      , 2);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}

