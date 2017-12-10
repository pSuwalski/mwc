import { Component, OnInit, Input } from '@angular/core';
import { Resolution, emptyPayment } from '../../../models/resolution';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../models/section';
import * as _ from 'lodash';

@Component({
  selector: 'mwc-legalbasis-data-form',
  templateUrl: './legalbasis-data-form.component.html',
  styleUrls: ['./legalbasis-data-form.component.css']
})
export class LegalbasisDataFormComponent implements OnInit, OnChanges {


  @Input() companyId = '';
  @Input() legalBasicsDataForm: Resolution;

  currentUser: User;
  sections: Section[];
  years: number[];

  constructor(
    private us: UserService,
    private ss: SectionService
  ) {
  }

  ngOnInit() {
    const year = new Date().getFullYear() + 1;
    this.years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => year - v);
    this.us.currentUser.subscribe((u) => {
      this.currentUser = u;
      this.ss.getCompanySections(this.currentUser.unionId, this.companyId).then((ss) => this.sections = ss);
    }
    );
  }

  ngOnChanges() {
    if (this.currentUser && this.companyId) {
      this.ss.getCompanySections(this.currentUser.unionId, this.companyId).then((ss) => this.sections = ss);
    }
  }

  containsSection(sectionId: string): boolean {
    return _.includes(this.legalBasicsDataForm.sectionIds, sectionId);
  }

  paymentCountChange() {
    setTimeout(() => {
      const difference = this.legalBasicsDataForm.payments.length - this.legalBasicsDataForm.paymentCount;
      console.log(difference);
      for (let i = 0; i < Math.abs(difference); i++) {
        if (difference < 0) {
          console.log('push');
          this.legalBasicsDataForm.payments.push(emptyPayment());
        } else if (difference > 0) {
          console.log('pop');
          this.legalBasicsDataForm.payments.pop();
        }
      }
    }, 1);
  }

  printBasis() {
    console.log(this.legalBasicsDataForm);
  }
}
