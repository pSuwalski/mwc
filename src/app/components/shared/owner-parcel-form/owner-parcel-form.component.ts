import { CompanyService } from '../../../services/company.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ParcelData, ParcelDataFull, emptyParcelData, emptyParcelDataFull } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Parcel, getParcelsPercent, OwnedInfo } from '../../../models/parcel';
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

  companyName: string;
  sectionName: string;

  @Input() parcelData: ParcelDataFull;
  @Input() smallerParcelData;
  currentUser: User;
  selectedParcels: Parcel[] = [];
  selectedSections: Section[] = [];
  selectedParcel: Parcel;

  otherOwners: OwnedInfo;

  @Input() editionDisabled = false;
  @Input() id: string;

  constructor(
    private ps: ParcelService,
    private cs: CompanyService,
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
      if (this.parcelData.companyId !== null) {
        this.ss.getCompanySections(this.currentUser.unionId, this.parcelData.companyId).then((sections) => {
          this.selectedSections = sections;
          this.progressBar = false;
        });
      }
      if (this.parcelData.sectionId !== null && this.parcelData.companyId !== null) {
        this.ps.getSectionParcels(this.currentUser.unionId, this.parcelData.companyId, this.parcelData.sectionId, false).then((parcels) => {
          this.selectedParcels = parcels;
          this.progressBar = false;
        });
      }
      if (this.parcelData.id) {
        this.ps.getSectionParcels(this.currentUser.unionId, this.parcelData.companyId, this.parcelData.sectionId, false).then((parcels) => {
          this.selectedParcels = parcels;
          this.progressBar = false;
          const parcel = this.selectedParcels.find((p) => p.id === this.parcelData.id);
          if (parcel) {
            this.parcelCtrl.setValue(parcel.number + ' ' + parcel.cityId);
          }
        });
      }
      if (this.editionDisabled) {
        this.parcelCtrl.disable();
      }
    }
  }

  isParcelData() {
    return (this.parcelData !== undefined);
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
    this.progressBar = true;
    this.parcelData.id = parcel.id;
    this.parcelCtrl.setValue(parcel.number + ' ' + parcel.cityId);
    this.ps.restoreParcel(this.currentUser.unionId, parcel.id).then((p) => {
      this.selectedParcel = p;
      this.progressBar = false;
      this.otherOwners = getParcelsPercent(p);
    });

  }


}
