import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../../models/owner';
import { OwnerService } from '../../services/owner.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-search-owner',
  templateUrl: './search-owner.component.html',
  styleUrls: ['./search-owner.component.css']
})
export class SearchOwnerComponent implements OnDestroy {

  currentUser: User;
  leesees: Owner[] = [];
  subsriptions: Subscription[] = [];

  constructor(
    private os: OwnerService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.os.getCompanyOwners(this.currentUser.unionId).then((lse: Owner[]) => {
          this.leesees = lse; /*this.parcelFilter = this.parcels;*/ });
      })
    );
   }

   ngOnDestroy() {
    // this.subsriptions.forEach((s) => s.unsubscribe());
  }


}
