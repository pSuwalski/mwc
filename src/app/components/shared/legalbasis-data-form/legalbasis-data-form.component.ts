import { Component, OnInit, Input } from '@angular/core';
import { Resolution, emptyPayment } from '../../../models/resolution';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../models/section';

@Component({
  selector: 'mwc-legalbasis-data-form',
  templateUrl: './legalbasis-data-form.component.html',
  styleUrls: ['./legalbasis-data-form.component.css']
})
export class LegalbasisDataFormComponent implements OnInit, OnChanges {


  @Input() companyId = '';
  @Input() legalBasicsDataForm: Resolution;
  @Input() editionDisabled = false;

  currentUser: User;
  sections: Section[];

  selectedYear: string;
  years = [
    { value: 2017, viewValue: '2017' },
    { value: 2016, viewValue: '2016' },
    { value: 2015, viewValue: '2015' },
    { value: 2014, viewValue: '2014' },
  ];

  constructor(
    private us: UserService,
    private ss: SectionService
  ) {
  }

  ngOnInit() {
    this.us.currentUser.subscribe((u) => {
      this.currentUser = u;
      this.ss.getCompanySections(this.currentUser.unionId, this.companyId).then((ss) => {
        this.sections = ss;
      });
    }
    );
  }

  ngOnChanges() {
    if (this.currentUser) {
      this.ss.getCompanySections(this.currentUser.unionId, this.companyId).then((ss) => this.sections = ss);
    }
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
