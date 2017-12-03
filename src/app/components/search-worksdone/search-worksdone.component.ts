import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Works } from '../../models/works';
import { WorksService } from '../../services/works.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-search-worksdone',
  templateUrl: './search-worksdone.component.html',
  styleUrls: ['./search-worksdone.component.css']
})
export class SearchWorksdoneComponent implements OnDestroy {

  currentUser: User;
  works: Works[] = [];
  selectedCompanyId: string;
  subsriptions: Subscription[] = [];
  searchString: string;

  constructor(
    public router: Router,
    private ws: WorksService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        if (cu.companies[0]) {
          this.selectedCompanyId = cu.companies[0].id;
          this.ws.SearchWorksByProtocolNumber(this.currentUser.unionId, '').then((wrk: Works[]) => {
          // this.ss.getCompanySections(this.currentUser.unionId, this.selectedCompanyId).then((sct: Section[]) => {
            this.works = wrk; /*this.parcelFilter = this.parcels;*/
          });
        }
      })
    );
   }

   showChosenWorks(works: Works) {
    this.ws.storeWorks(works);
    // this.router.navigate(['/view/works']);
  }

  searchSections() {
    this.ws.SearchWorksByProtocolNumber(this.currentUser.unionId, this.searchString).then((wrk: Works[]) => {
      this.works = wrk;
    });
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

}
