import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private appService: AppService,
    private navCtrl: NavController,
    private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.appService.getCurrentUserIdfromLocalStorage()
      .then((value) => {
        if (value === null || value === undefined) {
          this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
        }
      }).catch(() => {
        return false;
      });
    return true;
  }

  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   this.appService.getCurrentUserIdfromLocalStorage()
  //     .then((value) => {
  //       if (value === null || value === undefined) {
  //         // this.toast.show(`Session expired`, `2000`, 'bottom').subscribe(() => { });
  //         this.navCtrl.navigateForward('/userlogin', { animated: true, animationDirection: 'forward' });
  //       }
  //     }).catch(() => {
  //     });
  //   return true;
  // }

}
