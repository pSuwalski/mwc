import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { DialogService } from '../../../services/dialog.service';
import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'mwc-call-paper-dialog',
  templateUrl: './call-paper-dialog.component.html',
  styleUrls: ['./call-paper-dialog.component.css']
})
export class CallPaperDialogComponent implements OnInit {

  constructor(
    private dialogRef: MdDialogRef<CallPaperDialogComponent>,
    private ds: DialogService
  ) {
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
