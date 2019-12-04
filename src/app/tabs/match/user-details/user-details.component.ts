import { Component, Input } from '@angular/core';
import { AppService } from '../../../shared/services/app.service';

import { UserFriends, FriendshipStatus } from 'src/app/shared/model/user-friend.model';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})

export class UserDetailsComponent {

  @Input() user: UserFriends;
  public isActionTaken = false;

  constructor(private appService: AppService, private modalController: ModalController) { }

  public setdefultImage(event) {
    event.target.src = '/assets/no-image.png';
  }

  public acceptFriendShip() {
    this.actionOnFriendRequest(this.user, FriendshipStatus.Accepted);
    this.isActionTaken = true;
  }

  public rejectFriendShip() {
    this.actionOnFriendRequest(this.user, FriendshipStatus.Rejected);
    this.isActionTaken = true;
  }


  public actionOnFriendRequest(user: UserFriends, friendshipStatus: number) {
    this.appService.actionOnFriendRequest(user, friendshipStatus).then(() => {
      this.modalController.dismiss();
    });
  }
  public dismissModal() {
    this.modalController.dismiss();
  }
}
