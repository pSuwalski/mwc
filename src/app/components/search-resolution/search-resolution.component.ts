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
  selectedCompanyId: string;

  currentUser: User;
  resolutions: Resolution[] = [];
  subsriptions: Subscription[] = [];

  searchString: string;

  constructor(
    private rs: ResolutionsService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        // if (cu.companies[0]) {
        //   this.selectedCompanyId = cu.companies[0].id;
        //   this.rs.getCompanyResolutions(this.currentUser.unionId, this.selectedCompanyId).then((rst: Resolution[]) => {
        //     this.resolutions = rst; /*this.parcelFilter = this.parcels;*/
        //   });
        // }
      })
    );
  }

  searchResolutions() {
    this.rs.SearchResolutionByNumber('9098087076', this.searchString).then((rst: Resolution[]) => {
      this.resolutions = rst;
    });
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

}
