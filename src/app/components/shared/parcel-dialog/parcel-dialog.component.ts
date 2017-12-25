import { CompanyService } from '../../../services/company.service';
import { Component, Input, OnInit } from '@angular/core';
import { ParcelData, emptyParcelData, emptyParcelDataFull } from '../../../models/owner';
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
  selector: 'mwc-dialog-parcel',
  templateUrl: './parcel-dialog.component.html',
  styleUrls: ['./parcel-dialog.component.css']
})
export class ParcelDialogComponent implements OnInit {

  parcelDataForm: ParcelData;
  editionDisabled = false;

  constructor(
    private dialogRef: MdDialogRef<OwnerParcelFormComponent>,
    private ds: DialogService
  ) {
    this.parcelDataForm = this.ds.inputData;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close('cancel');
  }

  save() {
    this.dialogRef.close('save');
  }

}
