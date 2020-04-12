import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IonSlides, IonContent, ModalController, NavController } from '@ionic/angular';

import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { AppService } from '../../shared/services/app.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserMoreMenuPage } from './user-more-menu/user-more-menu.page';
import { FirebasedbService } from 'src/app/shared/services/firebasedb.service';
import * as moment from 'moment';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {

  public pageTabs: Array<{ id: number, tabName: string, friends: UserFriends[] }>;
  public selectedTab: number;
  public currentUserId: string;
  public isLoading = false;
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
      if (friends.length > 0) {
        this.isLoading = true;
        this.pageTabs[0].friends = this.friendFilter(friends, FriendshipStatus.Accepted);
        this.pageTabs[1].friends = this.friendFilter(friends, FriendshipStatus.Pending);

        this.appService.getUsersValueByKey('UserId').subscribe((value) => {
          this.currentUserId = value;
        });
        // bind the last message
        this.pageTabs[0].friends.forEach((friend) => {
          try {
            this.firebasedb.subscribeLastMessageItem(friend.UserId, this.currentUserId).subscribe((value) => {
              if (value[0]) {
                value[0].message = this.firebasedb.aesDecrypt(value[0].message, value[0].userId);
              }
              friend.UnreadMessagesCount = value.filter((item) => {
                return !item.isRead && item.userId !== this.currentUserId;
              }).length;

              friend.LastMessage = value[0] ? value[0] : null;

              const lastMessageArray = this.pageTabs[0].friends.filter((i) => {
                return i.LastMessage != null;
              });
              const nullMessageArray = this.pageTabs[0].friends.filter((i) => {
                return i.LastMessage === null;
              });
              // sorting Array
              const newArray = lastMessageArray
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
              nullMessageArray.forEach((item) => {
                newArray.push(item);
              });
              if (newArray.length === this.pageTabs[0].friends.length) {
                this.pageTabs[0].friends = newArray;
                this.isLoading = false;
              }
            });
          } catch (ex) {
            console.log(ex);
            this.isLoading = false;
          }
        });
      }
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
      this.isLoading = true;
      this.appService.getUserFriendsFromDB().then(() => {
        this.isLoading = false;
      });
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
    this.actionOnFriendRequest(friend, FriendshipStatus.Rejected);
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

  public doRefresh(event: any) {
    this.appService.getUserFriendsFromDB().then(() => {
      event.target.complete();
    });
    // No needed as of now.
    // this.appService.getRequestedFriendsFromDB();
  }

  public getLastMessageDateTime(value: string) {
    if (value) {
      const date = moment(value);
      const currentDate = moment();
      const diffInDay = currentDate.diff(date, 'day');
      if (diffInDay === 0) {
        return `${date.format('LT')}`;
      } else if (diffInDay === 1) {
        return `yesterday`;
      } else if (diffInDay > 1 && diffInDay <= 7) {
        return `${date.format('dddd')}`;
      } else if (diffInDay > 7) {
        return `${date.format('l')}`;
      }
    } else {
      return '';
    }
  }

}
