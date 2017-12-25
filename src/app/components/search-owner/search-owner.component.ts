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
  progressBar = true;

  currentUser: User;
  subsriptions: Subscription[] = [];
  searchType: 'evidenceNumber' | 'namesurname' | 'address';

  constructor(
    private router: Router,
    public os: OwnerService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.os.unionId = cu.unionId;
        this.os.getUnionOwners(this.currentUser.unionId).then((lse: Owner[]) => {
          this.os.owners = lse; /*this.parcelFilter = this.parcels;*/
          this.progressBar = false;
          console.log(lse);
        });
      })
    );
    this.searchType = 'namesurname';
  }

  ngOnDestroy() {
    // this.subsriptions.forEach((s) => s.unsubscribe());
  }

  showChosenOwner(owner: Owner) {
    this.os.storeOwner(owner);
    this.router.navigate(['/view/owner', owner.id]);
  }

  search() {
    this.progressBar = true;
    switch (this.searchType) {
      case 'evidenceNumber': {
        this.os.SearchUnionOwnersByEvidenceNumber(this.currentUser.unionId).then((o: string) => {
          this.progressBar = false;
        });
        break;
      }
      case 'namesurname': {
        this.os.SearchUnionOwnersByName(this.currentUser.unionId).then((o: string) => {
          this.progressBar = false;
        });
        break;
      }
      case 'address': {
        this.os.SearchUnionOwnersByAddress(this.currentUser.unionId).then((o: string) => {
          this.progressBar = false;
        });
        break;
      }
      default: {
        break;
      }
    }
  }
}
