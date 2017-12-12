import { Component } from '@angular/core';
import { Resolution, emptyResolution } from '../../models/resolution';
import { UserService } from '../../services/user.service';
import { ResolutionsService } from '../../services/resolutions.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import * as _ from 'lodash';

@Component({
  selector: 'mwc-add-resolution',
  templateUrl: './add-resolution.component.html',
  styleUrls: ['./add-resolution.component.css']
})
export class AddResolutionComponent implements OnDestroy {

  addedSuccessfully: string;
  companyId: string;
  currentUser: User;
  progressBar: boolean;
  subscriptions: Subscription[] = [];

  resolution: Resolution = emptyResolution();

  constructor(
    private db: ResolutionsService,
    private us: UserService
  ) {
    this.subscriptions.push(
      this.us.currentUser.subscribe((cu) => this.currentUser = cu)
    );
  }

  add() {
    this.progressBar = true;
    this.db.addResolution(this.resolution, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  changeCompanyId() {
    setTimeout(() =>
      this.companyId = this.resolution.companyId
      , 2);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // paymentsValidation(): boolean {
  //   return (
  //     this.resolution.paymentCount ?
  //       (this.resolution.payments.map((p) => p.paymentDate && p.paymentPercent).filter((b) => !b).length < 1
  //         &&
  //         _.reduce(this.resolution.payments, (p, n) => p.paymentPercent + n.paymentPercent, 0) === 100
  //       )
  //       :
  //       false
  //   );
  // }


}
