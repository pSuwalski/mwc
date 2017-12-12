import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Parcel } from '../../models/parcel';
import { ParcelService } from '../../services/parcel.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { SectionService } from '../../services/section.service';
import { Section } from '../../models/section';

@Component({
  selector: 'mwc-search-parcel',
  templateUrl: './search-parcel.component.html',
  styleUrls: ['./search-parcel.component.css']
})
export class SearchParcelComponent implements OnDestroy {

  progressBar = true;
  currentUser: User;
  parcels: Parcel[] = [];
  subsriptions: Subscription[] = [];
  selectedCompanyId: string;
  selectedSectionId: string;
  sections: Section[] = [];
  public searchString: string;
  numberSorted = false;
  areaTypeSorted = false;
  areaSurfaceSorted = false;
  trenchSorted = false;
  public parcelFilter: Parcel[];
  citySearchString: string;
  numberSearchString: string;

  constructor(
    private router: Router,
    public ps: ParcelService,
    private ss: SectionService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.ps.unionId = cu.unionId;
        this.progressBar = false;
      })
    );
    this.parcelFilter = this.parcels;
  }


  // onInput() {
  //   if (this.ss.searchString && this.ss.searchString.length === 0 && this.searchedAndNotNulled) {
  //     this.nulled = true;
  //   }
  // }

  onKeyDownCity(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.ps.searchParcels(this.ps.unionId, this.ps.companyId, this.ps.sectionId);
    }
  }

  onKeyDownNumber(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.ps.searchParcels(this.ps.unionId, this.ps.companyId, this.ps.sectionId);
    }
  }

  loadMore() {
    this.ps.loadMoreByNumber().then((prs: Parcel[]) => this.parcels.concat(prs));
  }

  ngOnDestroy() {
    this.subsriptions.forEach((s) => s.unsubscribe());
  }

  sortByNumber() {
    if (this.numberSorted === false) {
      this.parcels.sort((a, b) => a.number - b.number);
      this.numberSorted = true;
    } else {
      this.parcels.sort((a, b) => b.number - a.number);
      this.numberSorted = false;
    }
  }

  sortByAreaType() {
    if (this.areaTypeSorted === false) {
      this.parcels.sort((a, b) => {
        if (a.areaType < b.areaType) { return -1; }
        if (a.areaType > b.areaType) { return 1; }
        return 0;
      });
      this.areaTypeSorted = true;
    } else {
      this.parcels.sort((a, b) => {
        if (a.areaType > b.areaType) { return -1; }
        if (a.areaType < b.areaType) { return 1; }
        return 0;
      });
      this.areaTypeSorted = false;
    }
  }

  sortByAreaSurface() {
    if (this.areaSurfaceSorted === false) {
      this.parcels.sort((a, b) => a.areaSurface - b.areaSurface);
      this.areaSurfaceSorted = true;
    } else {
      this.parcels.sort((a, b) => b.areaSurface - a.areaSurface);
      this.areaSurfaceSorted = false;
    }
  }


  getCompanySections() {
    this.ps.sectionId = null;
    this.ss.getCompanySections(this.ps.unionId, this.ps.companyId).then((sct) => {
      this.sections = sct;
    });
  }

  getSectionParcels() {
    this.ps.searchParcels(this.ps.unionId, this.ps.companyId, this.ps.sectionId);
  }

  showChosenParcel(parcel: Parcel) {
    this.ps.storeParcel(parcel);
    this.router.navigate(['/view/parcel']);
  }

}
