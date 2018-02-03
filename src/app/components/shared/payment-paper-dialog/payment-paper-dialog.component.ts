import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { DialogService } from '../../../services/dialog.service';
import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'mwc-payment-paper-dialog',
  templateUrl: './payment-paper-dialog.component.html',
  styleUrls: ['./payment-paper-dialog.component.css']
})
export class PaymentPaperDialogComponent implements OnInit {

  constructor(
    private dialogRef: MdDialogRef<PaymentPaperDialogComponent>,
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
