import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Parcel } from '../../models/parcel';
import { ParcelService } from '../../services/parcel.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-search-parcel',
  templateUrl: './search-parcel.component.html',
  styleUrls: ['./search-parcel.component.css']
})
export class SearchParcelComponent implements OnDestroy {

  currentUser: User;
  parcels: Parcel[] = [];
  subsriptions: Subscription[] = [];

  constructor(
    private ps: ParcelService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.ps.getCompanyParcels(cu.companyId).then((prs: Parcel[]) => this.parcels = prs);
      })
    );
  }

  loadMore() {
    this.ps.loadMoreCompanyParcels(this.currentUser.companyId).then((prs: Parcel[]) => this.parcels.concat(prs));
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }


}
