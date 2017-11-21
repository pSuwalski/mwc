import { Resolution } from '../../models/resolution';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Parcel } from '../../models/parcel';
import { ResolutionsService } from '../../services/resolutions.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-search-resolution',
  templateUrl: './search-resolution.component.html',
  styleUrls: ['./search-resolution.component.css']
})
export class SearchResolutionComponent implements OnDestroy {

  currentUser: User;
  resolutions: Resolution[] = [];
  subsriptions: Subscription[] = [];

  constructor(
    private rs: ResolutionsService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.rs.getCompanyResolutions(this.currentUser.companyId).then((rst: Resolution[]) => {
          this.resolutions = rst; /*this.parcelFilter = this.parcels;*/ });
      })
    );
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

}
