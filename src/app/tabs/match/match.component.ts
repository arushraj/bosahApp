import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IonSlides, IonContent, ModalController, NavController } from '@ionic/angular';

import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { AppService } from '../../shared/services/app.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserMoreMenuPage } from './user-more-menu/user-more-menu.page';
import { FirebasedbService } from 'src/app/shared/services/firebasedb.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {

  public pageTabs: Array<{ id: number, tabName: string, friends: UserFriends[] }>;
  public selectedTab: number;
  public currentUserId: string;
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

  constructor(
    private appService: AppService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private firebasedb: FirebasedbService) {
    this.pageTabs = [
      { id: 0, tabName: 'Matches', friends: [] },
      { id: 1, tabName: 'Pending Matches', friends: [] }
      // ,{ id: 2, tabName: 'Sent', friends: [] }
    ];
    this.selectedTab = 0;
    this.appService.getFriendList().subscribe((friends) => {
      this.pageTabs[0].friends = this.friendFilter(friends, FriendshipStatus.Accepted);
      this.pageTabs[1].friends = this.friendFilter(friends, FriendshipStatus.Pending);

      this.appService.getUsersValueByKey('UserId').subscribe((value) => {
        this.currentUserId = value;
      });
      // bind the last message
      this.pageTabs[0].friends.forEach((friend) => {
        this.firebasedb.subscribeLastMessageItem(friend.UserId, this.currentUserId).subscribe((value) => {
          if (value[0]) {
            value[0].message = this.firebasedb.aesDecrypt(value[0].message, value[0].userId);
          }
          friend.LastMessage = value[0] ? value[0] : [];

          // sorting Array
          const newArray = this.pageTabs[0].friends
            .sort((a, b) => {
              if (a.LastMessage && b.LastMessage) {
                if (new Date(a.LastMessage.datetime) > new Date(b.LastMessage.datetime)) {
                  return -1;
                } else if (new Date(a.LastMessage.datetime) < new Date(b.LastMessage.datetime)) {
                  return 1;
                } else {
                  return 0;
                }
              } else {
                return 0;
              }
            });
        });
      });
    });
    // No Needed as of Now.
    // this.appService.getRequestedFriendList().subscribe((friends) => {
    //   this.pageTabs[2].friends = this.friendFilter(friends, FriendshipStatus.Pending);
    // });
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

    if (this.pageTabs[0].friends.length === 0) {
      this.appService.getUserFriendsFromDB();
    }
  }

  private friendFilter(friends: UserFriends[], friendType: number) {
    return friends.filter((friend: UserFriends) => {
      return friend.Status === friendType;
    });
  }

  public setdefultImage(event: any) {
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

  public async openDetails(user: UserFriends, tabId: number) {
    if (tabId !== this.pageTabs[0].id) {
      if (user.ProfileImagePath === undefined || user.ProfileImagePath === null) {
        user.ProfileImagePath = '';
      }
      const modal = await this.modalController.create({
        component: UserDetailsComponent,
        componentProps: { user, enableActionButton: true }
      });
      return await modal.present();
    } else {
      let from: string, fromUserName: string;
      await this.appService.getUsersValueByKey('UserId').subscribe((value) => {
        from = value;
      });
      await this.appService.getUsersValueByKey('FName').subscribe((value) => {
        fromUserName = value;
      });
      const info = {
        to: user.UserId,
        toUserName: user.FName,
        toProfileImagePath: user.ProfileImagePath,
        from,
        fromUserName
      };
      this.navCtrl.navigateForward(`/messaging?info=${JSON.stringify(info)}`, { animated: true, animationDirection: 'forward' });
    }
  }

  /**
   * openMoreOption
   */
  public async openMoreOption(event: any, friend: UserFriends) {
    const popover = await this.popoverCtrl.create({
      animated: true,
      backdropDismiss: true,
      componentProps: { friend },
      component: UserMoreMenuPage,
      event,
      translucent: true
    });
    return popover.present();
  }
  public doRefresh(event) {
    this.appService.getUserFriendsFromDB().then(() => {
      event.target.complete();
    });
    // No needed as of now.
    // this.appService.getRequestedFriendsFromDB();
  }

}
