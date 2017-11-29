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
  owners: Owner[] = [];
  subsriptions: Subscription[] = [];
  searchString: string;
  searchType: 'evidenceNumber' | 'namesurname' | 'address';

  constructor(
    private os: OwnerService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.os.getCompanyOwners(this.currentUser.unionId).then((lse: Owner[]) => {
          this.owners = lse; /*this.parcelFilter = this.parcels;*/
        });
      })
    );
    this.searchType = 'namesurname';
  }

  ngOnDestroy() {
    // this.subsriptions.forEach((s) => s.unsubscribe());
  }

  myFilter() {
    switch (this.searchType) {
      case 'evidenceNumber': {
        this.os.SearchCompanyOwnersByEvidenceNumber(this.currentUser.unionId, this.searchString).then((own: Owner[]) => {
          this.owners = own;
          console.log(this.owners);
        });
        break;
      }
      case 'namesurname': {
        this.os.SearchCompanyOwnersByName(this.currentUser.unionId, this.searchString).then((own: Owner[]) => {
          this.owners = own;
          console.log(this.owners);
        });
        break;
      }
      case 'address': {
        this.os.SearchCompanyOwnersByAddress(this.currentUser.unionId, this.searchString).then((own: Owner[]) => {
          this.owners = own;
          console.log(this.owners);
        });
        break;
      }
      default: {
        break;
      }
    }
  }
}
