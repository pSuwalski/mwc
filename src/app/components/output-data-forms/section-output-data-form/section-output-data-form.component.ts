import { Company } from '../../../models/company';
import { Component, OnInit } from '@angular/core';
import { Section } from '../../../models/section';
import { SectionService } from '../../../services/section.service';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'mwc-section-output-data-form',
  templateUrl: './section-output-data-form.component.html',
  styleUrls: ['./section-output-data-form.component.css']
})
export class SectionOutputDataFormComponent implements OnInit {

  companyName: string;
  section: Section;
  sectionTemp: Section;
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
    private route: ActivatedRoute
  ) {
    this.subsriptions.push(
      this.us.currentUser
        .combineLatest(this.route.params)
        .subscribe(([cu, params]) => {
          this.ss.restoreSection(cu.unionId, params['id']).then(sct => {
            if (sct !== null) {
              this.section = sct;
            } else {
              this.router.navigate(['/search/parcel']);
            }
          });
        })
    );
    this.companyName = '';
  }

  save() {
    this.progressBar = true;
    this.editionDisabled = true;
    this.ss.replaceSection(this.section, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  cancel() {
    this.section = _.cloneDeep(this.sectionTemp);
    this.editionDisabled = true;
  }


  edit() {
   this.sectionTemp = _.cloneDeep(this.section);
    this.editionDisabled = false;
  }

  goBack() {
    this.router.navigate(['/search/section']);
  }

  ngOnInit() {
  }
}
