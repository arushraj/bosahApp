import { Component, OnInit } from '@angular/core';

import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {

  public friends: UserFriends[];
  public pendingFriends: UserFriends[];

  constructor(private appService: AppService) {
    this.appService.getFriendList().subscribe((friends) => {
      this.friends = this.friendFilter(friends, FriendshipStatus.Accepted);
      this.pendingFriends = this.friendFilter(friends, FriendshipStatus.Pending);
    });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.appService.getUserFriendsFromDB();
  }

  private friendFilter(friends: UserFriends[], friendType: number) {
    return friends.filter((friend: UserFriends) => {
      return friend.Status === friendType;
    });
  }

  public setdefultImage(event) {
    event.target.src = '/assets/no-image.png';
  }

  public acceptFriendShip(friend: UserFriends) {
    this.actionOnFriendRequest(friend, FriendshipStatus.Accepted);
  }
  public rejectFriendShip(friend: UserFriends) {
    this.actionOnFriendRequest(friend, FriendshipStatus.Unfriended);
  }

  public actionOnFriendRequest(friend: UserFriends, friendshipStatus: number) {
    this.appService.actionOnFriendRequest(friend, friendshipStatus);
  }

}

