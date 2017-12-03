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
    this.works.parcelsData = this.works.parcelsData.map((pd) => _.omitBy(pd, (v) => _.isUndefined(v)));
    this.ws.addWorks(this.works, this.currentUser.unionId);
  }

  addParcel() {
    this.works.parcelsData.push(emptyWorksParcelDataFull());
  }

  removeParcel() {
    this.works.parcelsData.pop();
  }

}
