import { Component, OnInit } from '@angular/core';
// import { Company } from '../../../models/company';
// import { Section } from '../../../models/section';
import { Parcel } from '../../../models/parcel';
import { SectionService } from '../../../services/section.service';
import { CompanyService } from '../../../services/company.service';
import { ParcelService } from '../../../services/parcel.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'mwc-parcel-output-data-form',
  templateUrl: './parcel-output-data-form.component.html',
  styleUrls: ['./parcel-output-data-form.component.css']
})
export class ParcelOutputDataFormComponent implements OnInit {

  companyName: string;
  sectionName: string;
  parcel: Parcel;
  parcelTemp: Parcel;
  currentUser: User;
  subsriptions: Subscription[] = [];
  editionDisabled = true;
  progressBar: boolean;
  addedSuccessfully: string;

  constructor(
    public router: Router,
    private ss: SectionService,
    private cs: CompanyService,
    private us: UserService,
    private ps: ParcelService,
    private route: ActivatedRoute
  ) {
    this.subsriptions.push(
      this.us.currentUser
        .combineLatest(this.route.params)
        .subscribe(([cu, params]) => {
          this.ps.restoreParcel(cu.unionId, params['id']).then(prc => {
            if (prc !== null) {
              this.parcel = prc;
            } else {
              this.router.navigate(['/search/parcel']);
            }
          });
        })
    );

    this.sectionName = '';
    this.companyName = '';
  }

  save() {
    this.progressBar = true;
    this.editionDisabled = true;
    this.ps.replaceParcel(this.parcel, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  cancel() {
    this.parcel = _.cloneDeep(this.parcelTemp);
    this.editionDisabled = true;
  }


  edit() {
    this.parcelTemp = _.cloneDeep(this.parcel);
    this.editionDisabled = false;
  }

  goBack() {
    this.router.navigate(['/search/parcel']);
  }

  ngOnInit() {
  }

}
