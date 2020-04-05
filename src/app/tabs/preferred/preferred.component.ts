import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { PreferredUser } from '../../shared/model/preferred-user.model';
import { IonSlides, ActionSheetController, AlertController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';


@Component({
  selector: 'app-preferred',
  templateUrl: './preferred.component.html',
  styleUrls: ['./preferred.component.scss'],
})
export class PreferredComponent implements OnInit {

  public slideOpts = {
    initialSlide: 1,
    speed: 300,
    cancelable: true
  };
  public preferredUser: PreferredUser[];
  @ViewChild('preferredUserSlides', { read: IonSlides, static: true }) preferredUserSlides: IonSlides;

  constructor(
    private appService: AppService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController) {
    this.appService.getUserPreferred().subscribe((preferredUser) => {
      this.preferredUser = preferredUser;
    });
  }

  ngOnInit() {
    // this.appService.getUserPreferredFromDB();
  }

  ionViewDidEnter() {
    if (this.preferredUser.length === 1 && this.preferredUser[0].UserId === '') {
      this.appService.getUserPreferredFromDB();
    }
  }

  public setdefultImage(event: any) {
    event.target.src = '/assets/no-image.png';
  }

  public notIntrested() {
    this.preferredUserSlides.slideNext(1000, true).then(() => { });
  }

  public async sendFriendRequest(newFriend: PreferredUser) {
    this.appService.sendFriendRequest(newFriend);
  }

  public doRefresh(event: any) {
    this.appService.getUserPreferredFromDB().then(() => {
      event.target.complete();
    });
  }

  public async openReportUserProfileMenu(user: PreferredUser) {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
     
      cssClass: 'report-action-menu',
      header: `What’s Wrong With This Profile?`,
      subHeader: `Help keep Bosah safe letting us know why you’re reporting or blocking this user.`,
      buttons: [{
        icon: 'eye-off',
        text: `Block`,
        handler: () => {
          const userObject = this.getFriendObject(user);
          this.appService.actionOnFriendRequest(userObject, FriendshipStatus.Blocked).then(() => {
          });
        }
      },
      {
        icon: 'alert-circle',
        text: `Inappropriate content`,
        handler: async () => {
          const userObject = this.getFriendObject(user);
          const alert = await this.alertController.create({
            header: '',
            message: 'Would you like to <strong>block</strong> this user?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  console.log('Confirm Cancel');
                  this.appService.actionOnFriendRequest(userObject, FriendshipStatus.Report).then(async () => { });
                }
              }, {
                text: 'Yes',
                handler: () => {
                  console.log('Confirm Okay');
                  this.appService.actionOnFriendRequest(userObject, FriendshipStatus.Report).then(async () => {
                    this.appService.actionOnFriendRequest(userObject, FriendshipStatus.Blocked).then(() => { });
                  });
                }
              }
            ]
          });
          await alert.present();

        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  public actionOnFriendRequest(user: UserFriends, friendshipStatus: number) {
    this.appService.actionOnFriendRequest(user, friendshipStatus).then(() => {
    });
  }

  private getFriendObject(data: PreferredUser) {
    const user: UserFriends = {
      UserId: data.UserId,
      FName: data.FName,
      ProfileImagePath: data.ProfileImagePath,
      City: data.City,
      Age: data.Age,
      Gender: '',
      Status: 0,
      AboutMe: '',
      LastMessage: '',
      UserPet: '',
      UserDrinking: '',
      UserSmoking: '',
      College: '',
      Job: ''
    };
    return user;
  }

}
