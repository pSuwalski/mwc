import { Component } from '@angular/core';
import { Resolution } from '../../models/resolution';
import { UserService } from '../../services/user.service';
import { ResolutionsService } from '../../services/resolutions.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-add-resolution',
  templateUrl: './add-resolution.component.html',
  styleUrls: ['./add-resolution.component.css']
})
export class AddResolutionComponent implements OnDestroy {

  addedSuccessfully: string;
  currentUser: User;
  progressBar: boolean;
  subscriptions: Subscription[] = [];

  resolution: Resolution = {
      year: null, number: null, date: null, paymentI: null, paymentIPercent: null, paymentII: null,
      paymentIIPercent: null, paymentIII: null, paymentIIIPercent: null, paymentIV: null,
      paymentIVPercent: null, paymentMoreOneHour: null, paymentLessOneHour: null
  };

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
    this.db.addResolution(this.resolution, this.currentUser.companyId)
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
