import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-payment-paper',
  templateUrl: './payment-paper.component.html',
  styleUrls: ['./payment-paper.component.css']
})
export class PaymentPaperComponent implements OnInit {

  @Input() paymentPaperData: {
    unionId: string, ownerId: string, unionBankAccount: string,
    amount: string, payersBankAccount: string, payerName: string,
    title: string
  };

  currentUser: User;

  constructor(private us: UserService) {
    this.us.currentUser.subscribe((cu) => {
      this.currentUser = cu;
    });
  }

  ngOnInit() {
  }

}
