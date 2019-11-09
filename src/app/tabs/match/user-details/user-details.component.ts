import { Component, Input } from '@angular/core';
import { AppService } from '../../../shared/services/app.service';

import { UserFriends,FriendshipStatus } from 'src/app/shared/model/user-friend.model';


@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
})

export class UserDetailsComponent {

    @Input() user: UserFriends;

    constructor(private appService: AppService) { }

    public setdefultImage(event) {
        event.target.src = '/assets/no-image.png';
    }

    public cancelFriendShipRequest() {
        this.actionOnFriendRequest(this.user, FriendshipStatus.Cancelled);
        
      }
    
    
      public actionOnFriendRequest(user: UserFriends, friendshipStatus: number) {
        this.appService.actionOnFriendRequest(user, friendshipStatus);
        user.Status=FriendshipStatus.Cancelled;
      }
}
