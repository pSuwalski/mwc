import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { JoinApplication } from '../../models/join-aplication';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'mwc-home',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  joinApplications: JoinApplication[];

  constructor(
    private db: AngularFirestore
  ) {
    this.db.collection('joinApplications').ref.get().then((data) => {
      data.forEach((a) => console.log(a));
    });
  }


}
