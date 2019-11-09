import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, IonContent, ModalController } from '@ionic/angular';

import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { AppService } from '../../shared/services/app.service';
import { UserDetailsComponent } from './user-details/user-details.component';

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
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;

  constructor(private appService: AppService, private modalController: ModalController) {
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

  currentSegment(index: number) {
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  currentSlide() {
    this.SwipedTabsSlider.getActiveIndex().then(index => {
      this.selectedTab = index;
    });
  }

  ionViewDidEnter() {
    this.ionContent.scrollToTop(500);
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

  public async openDetails(user: UserFriends) {
    if (user.ProfileImagePath === undefined || user.ProfileImagePath === null) {
      user.ProfileImagePath = '';
    }
    const modal = await this.modalController.create({
      component: UserDetailsComponent,
      componentProps: { user }
    });
    return await modal.present();
  }

}

