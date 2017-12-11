import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Parcel } from '../../models/parcel';
import { ParcelService } from '../../services/parcel.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { SectionService } from '../../services/section.service';
import { Section, emptySection } from '../../models/section';

@Component({
  selector: 'mwc-search-parcel',
  templateUrl: './search-parcel.component.html',
  styleUrls: ['./search-parcel.component.css']
})
export class SearchParcelComponent implements OnDestroy {

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

  constructor(
    private router: Router,
    private ps: ParcelService,
    private ss: SectionService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        if (cu.companies[0]) {
          this.ps.getUnionParcels(cu.unionId)
            .then((prs: Parcel[]) => { this.parcels = prs; this.parcelFilter = this.parcels; });
        }
      })
    );

    console.log(this.sections);
    // this.sections[0] = emptySection();
    this.parcelFilter = this.parcels;
  }

  // onInput() {
  //   if (this.ss.searchString && this.ss.searchString.length === 0 && this.searchedAndNotNulled) {
  //     this.nulled = true;
  //   }
  // }

  // onKeyDown(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     this.searchSectionByName();
  //   }
  // }

  loadMore() {
    this.ps.loadMoreUnionParcels(this.currentUser.unionId).then((prs: Parcel[]) => this.parcels.concat(prs));
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

  // sortByTrench() {
  //   if (this.trenchSorted === false) {
  //     this.parcels.sort((a, b) => {
  //       if (a.trench < b.trench) { return -1; }
  //       if (a.trench > b.trench) { return 1; }
  //       return 0;
  //     });
  //     this.trenchSorted = true;
  //   } else {
  //     this.parcels.sort((a, b) => {
  //       if (a.trench > b.trench) { return -1; }
  //       if (a.trench < b.trench) { return 1; }
  //       return 0;
  //     });
  //     this.trenchSorted = false;
  //   }
  // }

  getCompanySections() {
    this.ss.getCompanySections(this.currentUser.unionId, this.selectedCompanyId).then((sct) => {
      this.sections = sct;
      console.log(this.sections);
    });
  }

  getSectionParcels() {
    this.ps.getSectionParcels(this.currentUser.unionId, this.selectedCompanyId, this.selectedSectionId).then((prc: Parcel[]) => {
      this.parcels = prc;
    });
    console.log(this.parcels);
  }

  MyFilter() {
    // this.ps.SearchParcelByNumber(this.currentUser.unionId, this.searchString).then((own: Parcel[]) => {
    //   this.parcels = own;
    // });
    console.log(this.parcels);
  }

  showChosenParcel(parcel: Parcel) {
    this.ps.storeParcel(parcel);
    this.router.navigate(['/view/parcel']);
  }

}
