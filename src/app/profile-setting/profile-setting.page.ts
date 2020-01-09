import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { CurrentUser } from '../shared/model/current-user.model';
import { PreferredGiftCards } from '../shared/model/preferredGiftcards.model';
import { AlertController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {

  public giftCard: PreferredGiftCards[];
  public currentUser: CurrentUser;
  public formData = {
    IsNotificationEnabled: false,
    IsProfileHidden: false,
    IsUserDeactivated: false
  };

  constructor(private appService: AppService, private alertController: AlertController, private inAppBrowser: InAppBrowser) {

    this.appService.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
      this.formData = {
        IsNotificationEnabled: this.currentUser.IsNotificationEnabled,
        IsProfileHidden: this.currentUser.IsProfileHidden,
        IsUserDeactivated: this.currentUser.IsUserDeactivated
      };
    });
  }

  ngOnInit() {
  }

  public setNotification() {
    if (this.currentUser.IsNotificationEnabled !== this.formData.IsNotificationEnabled) {
      const data = {
        IsNotificationEnabled: this.formData.IsNotificationEnabled,
        UserId: this.currentUser.UserId
      };
      this.appService.updateUser(data).then(() => { });
    }
  }

  public setProfileHidden() {
    if (this.currentUser.IsProfileHidden !== this.formData.IsProfileHidden) {
      const data = {
        IsProfileHidden: this.formData.IsProfileHidden,
        UserId: this.currentUser.UserId
      };
      this.appService.updateUser(data).then(() => { });
    }
  }

  public async setUserDeactivate() {
    if (this.formData.IsUserDeactivated) {
      /*
userState=2 deactivated
userState=1 active
userState-3 suspended
      */
      const data = {
        userState: 2,
        UserId: this.currentUser.UserId
      };
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
              this.formData.IsUserDeactivated = !this.formData.IsUserDeactivated;
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

  public openLink() {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    };
    const browser = this.inAppBrowser.create('http://bosahmobile.com/beta/', '_system');
  }

}
