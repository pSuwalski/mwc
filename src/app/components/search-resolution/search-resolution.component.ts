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

  // searchString: string;
  numberSearchString: string;

  constructor(
    private rs: ResolutionsService,
    private us: UserService,
    private router: Router
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;

      })
    );
  }

  onKeyDownNumber(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.searchResolutionByNumber();
    }
  }

  getCompanyResolutions() {
    this.rs.getCompanyResolutions(this.currentUser.unionId, this.selectedCompanyId).then((rst: Resolution[]) => {
      this.resolutions = rst;
      console.log(this.resolutions);
    });
  }

  searchResolutionByNumber() {
    this.rs.getCompanyResolutionsByNumber(this.currentUser.unionId, this.selectedCompanyId,
      this.numberSearchString).then((rst) => {
        this.resolutions = rst;
        console.log(this.resolutions);
      });
  }

  showChosenResolution(resolution: Resolution) {
    this.rs.storeResolution(resolution);
    this.router.navigate(['/view/resolution']);
  }

  // searchResolutions() {
  //   this.rs.SearchResolutionByNumber(this.currentUser.unionId, this.searchString).then((rst: Resolution[]) => {
  //     this.resolutions = rst;
  //   });
  // }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

}
