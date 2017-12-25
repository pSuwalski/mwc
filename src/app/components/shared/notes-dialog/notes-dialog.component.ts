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
import { PaymentsDataFormComponent } from '../payments-data-form/payments-data-form.component';
import { Note } from '../../search/searchresult/searchresult.component';


@Component({
  selector: 'mwc-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.css']
})
export class NotesDialogComponent implements OnInit {

  note: Note;
  editionDisabled = false;

  constructor(
    private dialogRef: MdDialogRef<PaymentsDataFormComponent>,
    private ds: DialogService
  ) {
    this.note = this.ds.inputData;
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
