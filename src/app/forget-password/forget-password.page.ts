import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../shared/services/app.service';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  @ViewChild('forgetPasswordslides', { read: IonSlides, static: true }) forgetPasswordslides: IonSlides;
  public userForm: FormGroup;
  public otpsend: boolean;

  private otp: string;

  constructor(private fb: FormBuilder, private loadingController: LoadingController, private appService: AppService, private toast: Toast) {
    this.userForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    }, {
      validators: this.mustMatchPassword('password', 'confirmPassword')
    });
  }

  private mustMatchPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnInit() {
    this.forgetPasswordslides.lockSwipes(true).then(() => { });
  }

  public async sendOTP() {
    if (this.userForm.value.email) {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: ''
      });
      loading.present();
      this.otp = Math.floor(1000 + Math.random() * 9000).toString();

      this.appService.sentotp(this.otp, this.userForm.value.email, true)
        .then(res => {
          const resData = JSON.parse(res.data);
          loading.dismiss();
          if (resData === 'Success') {
            this.otpsend = true;
          }
          this.toast.showShortBottom(`${resData}`).subscribe(() => { });
        })
        .catch(err => {
          loading.dismiss();
          this.toast.showShortBottom(`${JSON.stringify(err)}`).subscribe(() => { });
        });
    }
  }

  public reSendOTP() {
    this.sendOTP();
  }

  public onKey(event: any) {
    if (event.target.value.length === 4) {
      if (event.target.value !== this.otp) {
        this.toast.showShortBottom(`You have entered the wrong otp password.`).subscribe(() => { });
      } else {
        event.target.blur();
        this.forgetPasswordslides.lockSwipes(false).then(() => {
          this.forgetPasswordslides.slideNext(1000, true).then(() => {
            this.forgetPasswordslides.lockSwipes(true).then(() => { });
          });
        });
      }
    }
  }

  public onSubmit() {
    console.log(this.userForm);
    const data = {
      EmailId: this.userForm.value.email,
      Password: this.userForm.value.password
    };
    this.appService.updateUserPassword(data);
  }

}
