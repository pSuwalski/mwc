import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Component, OnInit, Input } from '@angular/core';
import { Resolution } from '../../../models/resolution';
import { ResolutionsService } from '../../../services/resolutions.service';

@Component({
  selector: 'mwc-notice-paper',
  templateUrl: './notice-paper.component.html',
  styleUrls: ['./notice-paper.component.css']
})
export class NoticePaperComponent implements OnInit {

  resolutions: Resolution[] = [];
  selectedCompanyId: string;

  @Input() noticePaperData: {
    status: string, resolutionId: string, name: string,
    surname: string, position: string, accountName: string, address: string,
    bankAccount: string, title: string, date: number
  };

  currentUser: User;

  constructor(private us: UserService, private rs: ResolutionsService) {
    this.us.currentUser.subscribe((cu) => {
      this.currentUser = cu;
    });
  }

  setCompanyId(id: string) {
    this.selectedCompanyId = id;
    const company = this.currentUser.companies.find((c) => c.id === id);
    this.noticePaperData.address = company.address.streetAndNumber + ', ' + company.address.postCode + ' ' + company.address.city;
    this.noticePaperData.accountName = company.name;
    this.resolutions = [];
    this.rs.getCompanyResolutions(this.currentUser.unionId, id).then((rst: Resolution[]) => {
      this.resolutions = rst.filter(r => r);
    });
  }

  ngOnInit() {
  }

}
