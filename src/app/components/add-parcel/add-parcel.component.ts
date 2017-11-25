
import { calcBindingFlags } from '@angular/core/src/view/util';
import { Component, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Parcel, emptyParcel } from '../../models/parcel';
import { UserService } from '../../services/user.service';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../models/user';

import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'mwc-add-parcel',
  templateUrl: './add-parcel.component.html',
  styleUrls: ['./add-parcel.component.css']
})
export class AddParcelComponent implements OnDestroy {

  addedSuccessfully: string;
  currentUser: User;
  progressBar: boolean;
  subscriptions: Subscription[] = [];

  parcel: Parcel = emptyParcel;

  constructor(
    private db: DatabaseService,
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
    this.db.addPercel(this.parcel, this.currentUser.unionId, this.parcel.companyId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}

