import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';
import { UserService } from '../services/user.service';

@Injectable()
export class UserResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private us: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.us.isUserLoggedIn().first().subscribe((state) => {
        if (state) {
          return resolve(true);
        } else {
          this.router.navigate(['/login']);
          return resolve(false);
        }
      });
    });
  }

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log(this.us.isUserLoggedIn());
    if (this.us.isUserLoggedIn()) {
      return Observable.of(true);
    } else {
      this.router.navigate(['/']);
      return Observable.of(false);
    }
  }
}
