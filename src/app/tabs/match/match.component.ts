import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IonSlides, IonContent, ModalController, NavController } from '@ionic/angular';
import { UserFriends, FriendshipStatus } from '../../shared/model/user-friend.model';
import { AppService } from '../../shared/services/app.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserMoreMenuPage } from './user-more-menu/user-more-menu.page';
import { FirebasedbService } from 'src/app/shared/services/firebasedb.service';
import * as moment from 'moment';
import { MessageService } from 'src/app/messaging/service/messaging.service';
import { MessageTpe } from 'src/app/shared/enum/MessageType';
import { from } from 'rxjs';
import { mergeMap, toArray, map, filter } from 'rxjs/operators';

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
    ];
    this.selectedTab = 0;
    this.appService.getUsersValueByKey('UserId').subscribe((value) => {
      this.currentUserId = value;
    });
    this.firebasedb.getFirebaseFriends().subscribe((friends) => {

      from(friends).pipe(
        filter(filterFriend => filterFriend.Status === FriendshipStatus.Accepted),
        toArray(),
        map(friend => friend.sort((a, b) => {
          if (moment(a.LastMessage.datetime).isAfter(moment(b.LastMessage.datetime))) {
            return -1;
          } else if (moment(a.LastMessage.datetime).isBefore(moment(b.LastMessage.datetime))) {
            return 1;
          } else {
            if (a.LastMessage.datetime === '') {
              return 1;
            } else if (b.LastMessage.datetime === '') {
              return -1;
            } else {
              return 0;
            }
          }
        }))
      ).subscribe((myFriends) => {
        this.pageTabs[0].friends = myFriends;
      });

      from(friends).pipe(
        filter(filterFriend => filterFriend.Status === FriendshipStatus.Pending),
        toArray(),
      ).subscribe((pendingFriendList) => {
        this.pageTabs[1].friends = pendingFriendList;
      });

    });
  }

  ngOnInit() {
  }

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
      let fromUser: string, fromUserName: string;
      await this.appService.getUsersValueByKey('UserId').subscribe((value) => {
        fromUser = value;
      });
      await this.appService.getUsersValueByKey('FName').subscribe((value) => {
        fromUserName = value;
      });
      const info = {
        to: user.UserId,
        toUserName: user.FName,
        toProfileImagePath: user.ProfileImagePath,
        fromUser,
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

  public getLastMessageDateTime(value: string, timeonly?: false, dateonly?: false) {
    if (value) {
      const date = moment(value);
      if (!timeonly && !dateonly) {
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
        if (timeonly) {
          return `${date.format('LT')}`;
        } else if (dateonly) {
          return `${date.format('L')}`;
        }
      }
    } else {
      return '';
    }
  }
}
