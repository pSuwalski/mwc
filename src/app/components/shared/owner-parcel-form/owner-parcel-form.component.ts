import { Component, Input, OnInit } from '@angular/core';
import { ParcelData, emptyParcelData } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Parcel } from '../../../models/parcel';
import * as _ from 'lodash';
import { ParcelService } from '../../../services/parcel.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'mwc-owner-parcel-form',
  templateUrl: './owner-parcel-form.component.html',
  styleUrls: ['./owner-parcel-form.component.css']
})
export class OwnerParcelFormComponent implements OnInit {
  filteredParcels: Observable<Parcel[]>;
  parcelCtrl: FormControl;

  @Input() parcelData: ParcelData;
  currentUser: User;
  selectedParcels: Parcel[] = [];


  constructor(
    private ps: ParcelService,
    private us: UserService
  ) {
    this.us.currentUser.subscribe((cu) => {
      this.currentUser = cu;
    });
    this.parcelCtrl = new FormControl();
    this.filteredParcels = this.parcelCtrl.valueChanges
      .startWith(null)
      .map(p => p ? this.filterParcels(p) : this.selectedParcels.slice());
  }


  filterParcels(name: string) {
    return this.selectedParcels.filter(parcel =>
      parcel.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
      parcel.cityId.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  ngOnInit() {
    this.parcelData.percent = 100;
  }

  selectCompany(id: string) {
    this.ps.getCompanyParcels(this.currentUser.unionId, id, false).then((parcels) => {
      this.selectedParcels = parcels;
    });
  }

  selectParcel(parcel: Parcel) {
    this.parcelData.id = parcel.id;
  }


}
