import { User } from '../../../models/user';
import { Component, OnInit, Input } from '@angular/core';
import { AuthData } from '../../../models/owner';
import { MdDialogRef } from '@angular/material';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'mwc-authorizations-dialog',
  templateUrl: './authorizations-dialog.component.html',
  styleUrls: ['./authorizations-dialog.component.css']
})
export class AuthorizationsDialogComponent implements OnInit {

  authDataForm: AuthData;
  editionDisabled = false;

  constructor(
    private dialogRef: MdDialogRef<AuthorizationsDialogComponent>,
    private ds: DialogService
  ) {
    this.authDataForm = this.ds.inputData;
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

