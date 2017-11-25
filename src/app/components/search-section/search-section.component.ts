import { Resolution } from '../../models/resolution';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from '../../models/section';
import { SectionService } from '../../services/section.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-search-section',
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.css']
})
export class SearchSectionComponent implements OnDestroy {


  currentUser: User;
  sections: Section[] = [];
  selectedCompanyId: string;
  subsriptions: Subscription[] = [];

  constructor(
    private ss: SectionService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        if (cu.companies[0]) {
          this.selectedCompanyId = cu.companies[0].id;
          this.ss.getCompanySections(this.currentUser.unionId, this.selectedCompanyId).then((sct: Section[]) => {
            this.sections = sct; /*this.parcelFilter = this.parcels;*/
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

}
