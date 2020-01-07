import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { CurrentUser } from '../shared/model/current-user.model';
import { PreferredGiftCards } from '../shared/model/preferredGiftcards.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {

  public giftCard: PreferredGiftCards[];
  public currentUser: CurrentUser;
  public userForm: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder, private alertController: AlertController) {
    this.userForm = this.fb.group({
      IsNotificationEnabled: [false, Validators.compose([Validators.required])],
      IsProfileHidden: [false, Validators.compose([Validators.required])],
      IsUserDeactivated: [false, Validators.compose([Validators.required])]
    });
    this.appService.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
      this.userForm.patchValue({
        IsNotificationEnabled: this.currentUser.IsNotificationEnabled,
        IsProfileHidden: this.currentUser.IsProfileHidden,
        IsUserDeactivated: this.currentUser.IsUserDeactivated
      });
    });
  }

  ngOnInit() {
  }

  public setNotification() {
    const data = {
      IsNotificationEnabled: this.userForm.value.IsNotificationEnabled,
      UserId: this.currentUser.UserId
    };
    this.appService.updateUser(data).then(() => { });
  }

  public setProfileHidden() {
    const data = {
      IsProfileHidden: this.userForm.value.IsProfileHidden,
      UserId: this.currentUser.UserId
    };
    this.appService.updateUser(data).then(() => { });
  }

  public async setUserDeactivate() {
    const data = {
      IsProfileHidden: this.userForm.value.IsProfileHidden,
      UserId: this.currentUser.UserId
    };
    if (this.userForm.value.IsUserDeactivated) {
      const alert = await this.alertController.create({
        header: `Confirmation!`,
        message: `Are you sure you want to <strong>deactivate account</strong>?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel');
              this.userForm.patchValue({
                IsUserDeactivated: false
              });
            }
          }, {
            text: 'Yes',
            handler: () => {
              console.log('Confirm Okay');
              this.appService.deactivateUser(data).then(() => { });
            }
          }
        ]
      });
      await alert.present();
    }
  }

}
