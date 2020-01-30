import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { CurrentUser } from '../shared/model/current-user.model';
import { PreferredGiftCards } from '../shared/model/preferredGiftCards.model';
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
  public IsNotificationEnabled = false;
  public IsProfileHidden = false;
  public IsUserDeactivated = false;
  // public formData :any= {
  //   IsNotificationEnabled: false,

  //   IsProfileHidden: false,
  //   IsUserDeactivated: false
  // };

  constructor(private appService: AppService, private alertController: AlertController, private inAppBrowser: InAppBrowser) {

    // this.appService.getCurrentUser().subscribe((data) => {
    //   this.currentUser = data;
    //   this.isNotiEnable=true;
    //   this.formData = {
    //     IsNotificationEnabled: this.currentUser.IsNotificationEnabled,
    //     IsProfileHidden: this.currentUser.IsProfileHidden,
    //     IsUserDeactivated: this.currentUser.IsUserDeactivated
    //   };
    // });
  }

  ngOnInit() {
    this.appService.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
      this.IsNotificationEnabled = this.currentUser.IsNotificationEnabled;
      this.IsProfileHidden = this.currentUser.IsProfileHidden;
      this.IsUserDeactivated = this.currentUser.IsUserDeactivated;
      // this.formData = {
      //   IsNotificationEnabled: this.currentUser.IsNotificationEnabled,
      //   IsProfileHidden: this.currentUser.IsProfileHidden,
      //   IsUserDeactivated: this.currentUser.IsUserDeactivated
      // };
    });
  }

  public setNotification() {
    if (this.currentUser.IsNotificationEnabled !== this.IsNotificationEnabled) {

      const selectedNotificationValue = (this.IsNotificationEnabled === true) ? 1 : 0;
      const data = {
        IsNotificationEnabled: selectedNotificationValue,
        UserId: this.currentUser.UserId
      };

      this.appService.updateUser(data).then(() => { });
    }
  }

  public setProfileHidden() {
    if (this.currentUser.IsProfileHidden !== this.IsProfileHidden) {
      const selectedProfileHiddenValue = (this.IsProfileHidden === true) ? 1 : 0;
      const data = {
        IsProfileHidden: selectedProfileHiddenValue,
        UserId: this.currentUser.UserId
      };
      this.appService.updateUser(data).then(() => { });
    }
  }

  public async setUserDeactivate() {
    if (this.IsUserDeactivated) {
      /*
userState=2 deactivated
userState=1 active
userState-3 suspended
 const selectedProfileHiddenValue=(this.IsProfileHidden==true) ? 1:0;
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
              this.IsUserDeactivated = !this.IsUserDeactivated;
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
      zoom: 'no',
      location: 'no',
      toolbar: 'no'
    };
    const browser = this.inAppBrowser.create('http://bosahmobile.com/beta/terms-conditions/', '_self', options);
  }

}
