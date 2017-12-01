import { Component, OnInit } from '@angular/core';
import { Section } from '../../../models/section';
import { SectionService } from '../../../services/section.service';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';


@Component({
  selector: 'mwc-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.css']
})
export class EditSectionComponent implements OnInit {

  companyName: string;
  section: Section;
  currentUser: User;
  subsriptions: Subscription[] = [];
  progressBar: boolean;
  addedSuccessfully: string;

  constructor(
    public router: Router,
    private ss: SectionService,
    private cs: CompanyService,
    private us: UserService
  ) {
    this.companyName = '';
    this.ss.restoreSection().then(sct => {
      if (sct !== null) {
        this.section = sct;
        this.subsriptions.push(
          this.us.currentUser.subscribe((cu) => {
            this.currentUser = cu;
            this.cs.SearchCompanyById(this.currentUser.unionId, this.section.companyId).then(cmp => {
              this.companyName = cmp[0].name;
            });
          })
        );
      }
    });
  }

  save() {
    this.progressBar = true;
    this.ss.replaceSection(this.section, this.currentUser.unionId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  goBack() {
    this.ss.storeSection(this.section);
    this.router.navigate(['/view/section']);
  }

  ngOnInit() {
  }

}
