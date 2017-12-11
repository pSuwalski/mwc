import { Component, OnInit } from '@angular/core';
import { Works, emptyWorks, emptyWorksParcelDataFull } from '../../models/works';
import * as _ from 'lodash';
import { WorksService } from '../../services/works.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'mwc-add-worksdone',
  templateUrl: './add-worksdone.component.html',
  styleUrls: ['./add-worksdone.component.css']
})
export class AddWorksdoneComponent implements OnInit {
  progressBar: boolean;

  addedSuccessfully: string;
  works: Works = emptyWorks();
  currentUser: User;

  constructor(
    private ws: WorksService,
    private us: UserService
  ) {
    this.us.currentUser.subscribe((cu) => {
      this.currentUser = cu;
    });
  }

  ngOnInit() {
  }

  add() {
    this.progressBar = true;
    this.works.parcelsData = this.works.parcelsData.map((pd) => _.omitBy(pd, (v) => _.isUndefined(v)));
    this.ws.addWorks(this.works, this.currentUser.unionId).then(() => {
      this.addedSuccessfully = 'success';
      this.progressBar = false;
    });
  }

  addParcel() {
    this.works.parcelsData.push(emptyWorksParcelDataFull());
  }

  reload() {
    this.works = emptyWorks();
    this.addedSuccessfully = null;
  }

  removeParcel() {
    this.works.parcelsData.pop();
  }

}
