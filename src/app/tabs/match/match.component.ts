import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {

  public pageTabs: Array<{ id: number, tabName: string, friends: UserFriends[] }>;
  public selectedTab: number;
  public slideOpts = {
    initialSlide: 0,
    speed: 300,
    cancelable: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  };
  @ViewChild('SwipedTabsSlider', { read: IonSlides, static: true }) SwipedTabsSlider: IonSlides;

  constructor(private appService: AppService) {
    this.pageTabs = [
      { id: 0, tabName: 'Friends', friends: [] },
      { id: 1, tabName: 'Pending', friends: [] },
      { id: 2, tabName: 'Sent', friends: [] }
    ];
    this.selectedTab = 0;

    this.appService.getFriendList().subscribe((friends) => {
      this.pageTabs[0].friends = this.friendFilter(friends, FriendshipStatus.Accepted);
      this.pageTabs[1].friends = this.friendFilter(friends, FriendshipStatus.Pending);
    });
    this.appService.getRequestedFriendList().subscribe((friends) => {
      this.pageTabs[2].friends = this.friendFilter(friends, FriendshipStatus.Pending);
    });
  }

  ngOnInit() { }

  currentSegment(index) {
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  currentSlide() {
    this.SwipedTabsSlider.getActiveIndex().then(index => {
      this.selectedTab = index;
    });
  }

  ionViewDidEnter() {
    this.currentSegment(this.pageTabs[0].id);
    this.selectedTab = this.pageTabs[0].id;

    this.appService.getUserFriendsFromDB();
    this.appService.getRequestedFriendsFromDB();
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

