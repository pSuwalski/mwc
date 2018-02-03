import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { DialogService } from '../../../services/dialog.service';
import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'mwc-notice-paper-dialog',
  templateUrl: './notice-paper-dialog.component.html',
  styleUrls: ['./notice-paper-dialog.component.css']
})
export class NoticePaperDialogComponent implements OnInit {

  constructor(
    private dialogRef: MdDialogRef<NoticePaperDialogComponent>,
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
