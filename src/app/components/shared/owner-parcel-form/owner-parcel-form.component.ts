import { Component, Input, OnInit } from '@angular/core';
import { ParcelData, emptyParcelData } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Parcel } from '../../../models/parcel';
import * as _ from 'lodash';
import { ParcelService } from '../../../services/parcel.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../models/section';


@Component({
  selector: 'mwc-owner-parcel-form',
  templateUrl: './owner-parcel-form.component.html',
  styleUrls: ['./owner-parcel-form.component.css']
})
export class OwnerParcelFormComponent implements OnInit {
  filteredParcels: Observable<Parcel[]>;
  parcelCtrl: FormControl;
  progressBar = true;

  @Input() parcelData: ParcelData;
  currentUser: User;
  selectedParcels: Parcel[] = [];
  selectedSections: Section[] = [];


  constructor(
    private ps: ParcelService,
    private ss: SectionService,
    private us: UserService
  ) {
    this.us.currentUser.subscribe((cu) => {
      this.currentUser = cu;
      this.progressBar = false;
    });
    this.parcelCtrl = new FormControl();
    this.filteredParcels = this.parcelCtrl.valueChanges
      .startWith('a')
      .map(p => p ? this.filterParcels(p) : this.selectedParcels);
  }


  filterParcels(name: string) {
    return this.selectedParcels.filter(parcel =>
      parcel.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
      parcel.cityId.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  ngOnInit() {
    if (this.isParcelData()) {
      this.parcelData.percent = 100;
    }
  }

  isParcelData() {
    return this.parcelData.percent !== undefined;
  }

  selectCompany(id: string) {
    this.parcelData.id = null;
    this.parcelData.sectionId = null;
    this.parcelData.companyId = id;
    this.progressBar = true;
    this.ss.getCompanySections(this.currentUser.unionId, id).then((sections) => {
      this.selectedSections = sections;
      this.progressBar = false;
    });
  }

  selectSection(id: string) {
    this.parcelData.id = null;
    this.parcelData.sectionId = id;
    this.progressBar = true;
    this.ps.getSectionParcels(this.currentUser.unionId, this.parcelData.companyId, id, false).then((parcels) => {
      this.selectedParcels = parcels;
      this.progressBar = false;
    });
  }

  selectParcel(parcel: Parcel) {
    this.parcelData.id = parcel.id;
    this.parcelCtrl.setValue(parcel.number + ' ' + parcel.cityId);
  }


}
