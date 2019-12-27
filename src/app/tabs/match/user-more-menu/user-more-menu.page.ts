import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-user-more-menu',
  templateUrl: './user-more-menu.page.html',
  styleUrls: ['./user-more-menu.page.scss'],
})
export class UserMoreMenuPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    private appService: AppService,
    private navCtrl: NavController) { }

  @Input() friend;

  ngOnInit() {
    console.log(this.friend);
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
      fromUserName
    };
    this.dismissPopover();
    this.navCtrl.navigateForward(`/messaging?info=${JSON.stringify(info)}`, { animated: true, animationDirection: 'forward' });
  }

}
