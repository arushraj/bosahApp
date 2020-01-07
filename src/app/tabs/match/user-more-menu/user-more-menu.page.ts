import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavController, ModalController, AlertController } from '@ionic/angular';
import { AppService } from '../../../shared/services/app.service';
import { UserFriends, FriendshipStatus } from '../../../shared/model/user-friend.model';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-user-more-menu',
  templateUrl: './user-more-menu.page.html',
  styleUrls: ['./user-more-menu.page.scss'],
})
export class UserMoreMenuPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    private appService: AppService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private alertController: AlertController) { }

  @Input() friend: UserFriends;

  ngOnInit() {
  }

  public dismissPopover() {
    this.popoverCtrl.dismiss();
  }

  public openMessageBox() {
    let from: any, fromUserName: any;
    this.appService.getUsersValueByKey('UserId').subscribe((value) => {
      from = value;
    });
    this.appService.getUsersValueByKey('FName').subscribe((value) => {
      fromUserName = value;
    });
    const info = {
      to: this.friend.UserId,
      toUserName: this.friend.FName,
      toProfileImagePath: this.friend.ProfileImagePath,
      from,
      fromUserName,
      friend: this.friend
    };
    this.dismissPopover();
    this.navCtrl.navigateForward(`/messaging?info=${JSON.stringify(info)}`, { animated: true, animationDirection: 'forward' });
  }

  public async profileView() {
    if (this.friend.ProfileImagePath === undefined || this.friend.ProfileImagePath === null) {
      this.friend.ProfileImagePath = '';
    }
    const modal = await this.modalController.create({
      component: UserDetailsComponent,
      componentProps: { user: this.friend, enableActionButton: false }
    });
    this.dismissPopover();
    return await modal.present();
  }

  public async unFriend() {
    this.dismissPopover();
    const alert = await this.alertController.create({
      header: 'Confirmation!',
      message: `Are you sure you'd like to <strong>Unfriend</strong>?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.actionOnFriendRequest(this.friend, FriendshipStatus.Unfriended);
          }
        }
      ]
    });
    await alert.present();
  }

  public async blockUser() {
    this.dismissPopover();
    const alert = await this.alertController.create({
      header: 'Confirmation!',
      message: `Are you sure you'd like to <strong>block</strong>?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.actionOnFriendRequest(this.friend, FriendshipStatus.Blocked);
          }
        }
      ]
    });
    await alert.present();
  }

  public actionOnFriendRequest(user: UserFriends, friendshipStatus: number) {
    this.appService.actionOnFriendRequest(user, friendshipStatus).then(() => {
    });
  }

}
