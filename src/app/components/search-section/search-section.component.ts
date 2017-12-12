import { Resolution } from '../../models/resolution';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from '../../models/section';
import { SectionService, } from '../../services/section.service';
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

  progressBar = true;
  currentUser: User;
  subsriptions: Subscription[] = [];
  nulled = false;
  searchedAndNotNulled = false;

  constructor(
    public router: Router,
    public ss: SectionService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.progressBar = false;
        this.currentUser = cu;
        this.ss.unionId = cu.unionId;
      })
    );
  }

  onInput() {
    if (this.ss.searchString && this.ss.searchString.length === 0 && this.searchedAndNotNulled) {
      this.nulled = true;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.searchSectionByName();
    }
  }

  showChosenSection(section: Section) {
    this.ss.storeSection(section);
    this.router.navigate(['/view/section', section.id]);
  }

  searchSectionByName() {
    this.progressBar = true;
    this.ss.SearchSectionsByName(this.ss.unionId, this.ss.selectedCompanyId, this.ss.searchString).then(() => {
      this.searchedAndNotNulled = true;
      this.nulled = false;
      this.progressBar = false;
    });
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

}
