import { Component, OnInit } from '@angular/core';
import { Resolution } from '../../../models/resolution';
import { ResolutionsService } from '../../../services/resolutions.service';
// import { Section } from '../../../models/section';
import { SectionService } from '../../../services/section.service';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'mwc-resolution-output-data-form',
  templateUrl: './resolution-output-data-form.component.html',
  styleUrls: ['./resolution-output-data-form.component.css']
})
export class ResolutionOutputDataFormComponent implements OnInit {

  companyName: string;
  resolution: Resolution;
  resolutionTemp: Resolution;
  currentUser: User;
  subsriptions: Subscription[] = [];
  editionDisabled = true;
  progressBar: boolean;
  addedSuccessfully: string;

  constructor(
    public router: Router,
    private rs: ResolutionsService,
    private ss: SectionService,
    private cs: CompanyService,
    private us: UserService,
    private route: ActivatedRoute
  ) {
    this.companyName = '';
    this.subsriptions.push(
      this.us.currentUser
        .combineLatest(this.route.params)
        .subscribe(([cu, params]) => {
          this.rs.restoreResolution(cu.unionId, params['id']).then(res => {
            if (res !== null) {
              this.resolution = res;
              this.currentUser = cu;
              this.cs.SearchCompanyById(this.currentUser.unionId, this.resolution.companyId).then(cmp => {
                this.companyName = cmp[0].name;
              });
            } else {
              this.router.navigate(['/search/resolution']);
            }
          });
        })
    );
  }

  ngOnInit() {
  }

  save() {
    this.progressBar = true;
    this.editionDisabled = true;
    this.rs.replaceResolution(this.resolution, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  cancel() {
    this.resolution = _.cloneDeep(this.resolutionTemp);
    this.editionDisabled = true;
  }


  edit() {
    this.resolutionTemp = _.cloneDeep(this.resolution);
    this.editionDisabled = false;
  }

  goBack() {
    this.router.navigate(['/search/resolution']);
  }

}
