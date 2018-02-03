import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-call-paper',
  templateUrl: './call-paper.component.html',
  styleUrls: ['./call-paper.component.css']
})
export class CallPaperComponent implements OnInit {

  @Input() callPaperData: {
    status: string, companyId: string, name: string,
    surname: string, position: string, cashAddress: string,
    bankName: string, bankAccount: string, contactPhone: string, contactEmail: string
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
