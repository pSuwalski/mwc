import { Company } from '../../../models/company';
import { Component, OnInit } from '@angular/core';
import { Section } from '../../../models/section';
import { SectionService } from '../../../services/section.service';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'mwc-section-output-data-form',
  templateUrl: './section-output-data-form.component.html',
  styleUrls: ['./section-output-data-form.component.css']
})
export class SectionOutputDataFormComponent implements OnInit {

  companyName: string;
  section: Section;
  currentUser: User;
  subsriptions: Subscription[] = [];

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

  edit() {
    this.ss.storeSection(this.section);
    this.router.navigate(['/edit/section']);
  }

  goBack() {
    this.router.navigate(['/search/section']);
  }

  ngOnInit() {
  }
}
