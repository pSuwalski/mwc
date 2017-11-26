import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { JoinApplication } from '../../models/join-aplication';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'mwc-home',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  joinApplications: JoinApplication[];

  constructor(
    private us: UserService
  ) {
    this.us.getJoinApplications().then((jas) => {
      this.joinApplications = jas;
    });
  }

  accept(ja: JoinApplication) {
    this.us.rejectJoinAppliction(ja.union.nip);
  }
  reject(ja: JoinApplication) {
    this.us.rejectJoinAppliction(ja.union.nip);
  }


}
