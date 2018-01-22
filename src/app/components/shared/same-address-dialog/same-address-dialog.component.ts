import { CompanyService } from '../../../services/company.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthData, ParcelData, emptyParcelData, emptyParcelDataFull } from '../../../models/owner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Parcel } from '../../../models/parcel';
import * as _ from 'lodash';
import { ParcelService } from '../../../services/parcel.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../models/section';
import { DialogService } from '../../../services/dialog.service';
import { MdDialogRef } from '@angular/material';
import { OwnerParcelFormComponent } from '../owner-parcel-form/owner-parcel-form.component';


@Component({
  selector: 'mwc-same-address-dialog',
  templateUrl: './same-address-dialog.component.html',
  styleUrls: ['./same-address-dialog.component.css']
})
export class SameAddressDialogComponent implements OnInit {

  authDatas: AuthData[];
  selectedIndex: any;

  constructor(
    private dialogRef: MdDialogRef<OwnerParcelFormComponent>,
    private ds: DialogService
  ) {
    this.authDatas = this.ds.inputData;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close('cancel');
  }

  save() {
    this.dialogRef.close(this.selectedIndex);
  }

}
