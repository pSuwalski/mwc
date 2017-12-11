import { Component, OnInit } from '@angular/core';
import { Works } from '../../../models/works';
import { WorksService } from '../../../services/works.service';
// import { SectionService } from '../../../services/section.service';
// import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'mwc-works-output-data-form',
  templateUrl: './works-output-data-form.component.html',
  styleUrls: ['./works-output-data-form.component.css']
})
export class WorksOutputDataFormComponent implements OnInit {

  works: Works;
  worksTemp: Works;
  currentUser: User;
  subsriptions: Subscription[] = [];
  editionDisabled = true;
  progressBar: boolean;
  addedSuccessfully: string;

  constructor(
    public router: Router,
    private wk: WorksService,
    private us: UserService
  ) {

    this.wk.restoreWorks().then(wrk => {
      if (wrk !== null) {
        this.works = wrk;
        this.subsriptions.push(
          this.us.currentUser.subscribe((cu) => {
            this.currentUser = cu;

          })
        );
      }
    });
  }

  save() {
    this.progressBar = true;
    this.editionDisabled = true;
    this.wk.replaceWorks(this.works, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  cancel() {
    this.works = _.cloneDeep(this.worksTemp);
    this.editionDisabled = true;
  }


  edit() {
   this.worksTemp = _.cloneDeep(this.works);
    this.editionDisabled = false;
  }

  goBack() {
    this.router.navigate(['/search/works']);
  }

  ngOnInit() {
  }

}
