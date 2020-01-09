import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavController, ModalController, AlertController } from '@ionic/angular';
import { AppService } from '../../shared/services/app.service';
import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-more-menu',
  templateUrl: './more-menu.page.html',
  styleUrls: ['./more-menu.page.scss'],
})
export class MoreMenuPage implements OnInit {

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

  public async profileView() {
    if (this.friend.ProfileImagePath === undefined || this.friend.ProfileImagePath === null) {
      this.friend.ProfileImagePath = '';
    }
    const modal = await this.modalController.create({
      component: UserDetailsComponent,
      componentProps: { user: this.friend, enableActionButton: false }
    });
    this.popoverCtrl.dismiss();
    return await modal.present();
  }

  public async unFriend() {
    this.dismissPopover();
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure, You want to <strong>Unfriend</strong>?',
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
      header: 'Confirm!',
      message: 'Are you sure, You want to <strong>block</strong>?',
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
      this.modalController.dismiss();
    });
  }
}
