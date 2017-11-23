
import { calcBindingFlags } from '@angular/core/src/view/util';
import { Component, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Parcel } from '../../models/parcel';
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

  parcel: Parcel = {
    sectionId: null, number: null, areaType: null, areaSurface: null, trench: false, yearNumber: null,
    drainage: null, numbering: null, applianceType: null, applianceDescription: null, membership: true, membershipActive: true,
    legalBasis: null, SwMembershipStartDate: null, SwMembershipTerminationDate: null,
    foremanDecisions: [{
      decisionNumber: null,
      decisionDate: null
    }]
  };

  constructor(
    private db: DatabaseService,
    private us: UserService
  ) {
    this.subscriptions.push(
      this.us.currentUser.subscribe((cu) => this.currentUser = cu)
    );
  }


  add() {
    this.progressBar = true;
    this.db.addPercel(this.parcel, this.currentUser.companyId)
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

