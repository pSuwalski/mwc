import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Leesee } from '../../models/leesee';
import { LeeseeService } from '../../services/leesee.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'mwc-search-leesee',
  templateUrl: './search-leesee.component.html',
  styleUrls: ['./search-leesee.component.css']
})
export class SearchLeeseeComponent implements OnDestroy {

  currentUser: User;
  leesees: Leesee[] = [];
  subsriptions: Subscription[] = [];

  constructor(
    private ps: LeeseeService,
    private us: UserService
  ) {
    this.subsriptions.push(
      this.us.currentUser.subscribe((cu) => {
        this.currentUser = cu;
        this.ps.getLeesees().then((prs: Leesee[]) => {this.leesees = prs; console.log(prs); /*this.parcelFilter = this.parcels;*/ });
      })
    );
   }

   ngOnDestroy() {
    // this.subsriptions.forEach((s) => s.unsubscribe());
  }


}
