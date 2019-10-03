import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { AppService } from '../shared/services/app.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  public user = {
    email: '',
    password: ''
  };
  constructor(
    private googleplus: GooglePlus,
    private fb: Facebook,
    private toast: Toast,
    private appService: AppService,
    private navCtrl: NavController,
    private router: Router) {
  }

  ngOnInit() { }

  public googleLogin() {
    this.toast.show(
      `Coming Soon..`,
      '2000',
      'bottom')
      .subscribe(toast => {
        // console.log(JSON.stringify(toast));
      });
    // this.googleplus.login({})
    //   .then(res => {
    //     this.user = res;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  public fbLogin() {
    this.toast.show(
      `Coming Soon..`,
      '2000',
      'bottom')
      .subscribe(toast => {
        // console.log(JSON.stringify(toast));
      });
    // this.fb.login(['public_profile'])
    //   .then((res: FacebookLoginResponse) => {
    //     this.user = res;
    //     this.fb.api('/me?fields=id,name,birthday,gender,email', ['public_profile', 'user_birthday', 'user_gender', 'email'])
    //       .then(data => {
    //         this.user = data;
    //       });
    //   })
    //   .catch(e => console.log('Error logging into Facebook', e));
    // this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  public userLogin() {
    if (this.user.email && this.user.password) {
      this.appService.userLogin(this.user.email, this.user.password)
        .then((data) => {
          this.toast.show(
            `${data.ResponseMessage}`,
            `2000`,
            `bottom`
          ).subscribe(toast => { });
          if (data.UserId > 0) {
            // this.navCtrl.navigateForward('/tabs', { animated: true, animationDirection: 'forward' });
            this.router.navigate(['/tabs']);
          }
        });
    }
  }

}
