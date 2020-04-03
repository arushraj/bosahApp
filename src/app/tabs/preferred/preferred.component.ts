import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { PreferredUser } from '../../shared/model/preferred-user.model';
import { IonSlides, ActionSheetController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';


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
    private toast: Toast,
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

  public async openReportUserProfileMenu(userId: PreferredUser) {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      cssClass: 'report-action-menu',
      header: `What's wrong with this profile?`,
      subHeader: `Help us keep the Hive safe by telling us why you're reporting or blocking this user. Don't worry, this is anonymous.`,
      buttons: [{
        icon: 'eye-off',
        text: `I don't want them to see me`,
        handler: () => {
          // call the function()
          console.log(userId);
        }
      },
      {
        icon: 'sad',
        text: `Made me uncomfortable`,
        handler: () => {

        }
      },
      {
        icon: 'alert-circle',
        text: `Inappropriate content`,
        handler: () => {

        }
      },
      {
        icon: 'camera',
        text: `Stolen photo`,
        handler: () => {

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

}
