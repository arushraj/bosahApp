import { Component, OnInit } from '@angular/core';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { AppService } from '../shared/services/app.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    // private googleplus: GooglePlus,
    // private fb: Facebook,
    private toast: Toast,
    private appService: AppService,
    private navCtrl: NavController,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.appService.getCurrentUserIdfromLocalStorage().then(value => {
      if (value !== null) {
        this.navCtrl.navigateRoot('/tabs', { animated: true, animationDirection: 'forward' });
      }
    });
  }

  // public googleLogin() {
  //   this.toast.show(
  //     `Coming Soon..`,
  //     '2000',
  //     'bottom')
  //     .subscribe(toast => {
       
  //     });
   
  // }

  // public fbLogin() {
  //   this.toast.show(
  //     `Coming Soon..`,
  //     '2000',
  //     'bottom')
  //     .subscribe(toast => {
       
  //     });
   
  // }

  public userLogin() {
    this.appService.userLogin(this.loginForm.value.email, this.loginForm.value.password)
    
      .then((data) => {
        this.toast.show(
          `${data.ResponseMessage}`,
          `2000`,
          `bottom`
        ).subscribe(toast => { });
        if (data.UserId > 0) {
         
         
          this.navCtrl.navigateRoot('/tabs', { animated: true, animationDirection: 'forward' });
          // this.router.navigate(['/tabs']);
        }
      });
  }

}
