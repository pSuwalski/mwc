import { Component, HostBinding } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import * as _ from 'lodash';

@Component({
  selector: 'mwc-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  constructor(
    private db: DatabaseService
  ) {

  }

  public index = 0;

  public model: any = { dataForm: {code : null} };

  next() {
    this.index += 1;
  }
  addUsersData() {
    this.db.addData(_.omitBy(this.model, _.isUndefined || _.isNull), 'companyId/usersData');
  }
}


