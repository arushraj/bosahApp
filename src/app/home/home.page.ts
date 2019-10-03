import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public googleData: string;
  constructor(private googlePlus: GooglePlus) { }

  public googleLogin(): void {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        this.googleData = res;
      })
      .catch(err => {
        console.error(err);
        this.googleData = err;
      });
  }

  public googleLogout(): void {
    this.googlePlus.logout()
      .then(res => { this.googleData = res; })
      .catch(err => { this.googleData = err; });
  }

}
