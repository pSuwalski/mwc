import { Section } from '../../models/section';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SectionService } from '../../services/section.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'mwc-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnDestroy {

  addedSuccessfully: string;
  currentUser: User;
  progressBar: boolean;
  subscriptions: Subscription[] = [];

  section: Section = {
    areaType: null, evidenceNumber: null, name: null, parcels: null
  };

  constructor(
    private db: SectionService,
    private us: UserService
  ) {
    this.subscriptions.push(
      this.us.currentUser.subscribe((cu) => this.currentUser = cu)
    );
  }

  add() {
    this.progressBar = true;
    this.db.addSection(this.section, this.currentUser.companyId)
      .then((res) => {
        this.progressBar = false;
        this.addedSuccessfully = res;
      })
      .catch((e) => console.log(e));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
