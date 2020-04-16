import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AppService } from '../shared/services/app.service';
import { Toast } from '@ionic-native/toast/ngx';
import { FirebasedbService } from '../shared/services/firebasedb.service';
import { from } from 'rxjs';
import { filter, groupBy, mergeMap, toArray, find, first, every, findIndex } from 'rxjs/operators';
import { FriendshipStatus } from '../shared/model/user-friend.model';
import { UserMessage } from '../shared/model/firebase.model';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  public tabs = [{
    name: 'Suggested',
    icon: 'star-outline',
    route: 'preferred',
    index: 0
  }, {
    name: 'Match',
    icon: '/assets/heart.svg',
    route: 'match',
    index: 1
  }, {
    name: 'Profile',
    icon: 'person-circle-outline',
    route: 'userprofile',
    index: 2
  },
  {
    name: 'Search',
    icon: 'search-circle-outline',
    route: 'flatsearchform',
    index: 3
  }
  ];
  public badgeCount: number;
  private currentUserId: string;
  // {
  //   name: 'Events',
  //   icon: 'calendar',
  //   route: 'events'
  // }


  @ViewChild('apptabs', { read: IonTabs, static: true }) apptabs: IonTabs;
  constructor(
    private appService: AppService,
    private firebasedb: FirebasedbService) {

    this.appService.getNotificationCount()
      .subscribe(count => {
        this.badgeCount = count;
      });

    this.appService.getUsersValueByKey('UserId').subscribe((value) => {
      this.currentUserId = value;
    });

    this.appService.getFriendList().subscribe((friends) => {
      from(friends).pipe(
        filter(friend => friend.Status === FriendshipStatus.Accepted)
      ).subscribe((myFriends) => {
        this.firebasedb.subscribeLastMessageItem(myFriends.UserId, this.currentUserId).subscribe((messages) => {
          from(messages).pipe(
            filter(filterMessage => !filterMessage.isRead && filterMessage.userId !== this.currentUserId),
            groupBy(groupMessage => !groupMessage.isRead && groupMessage.userId !== this.currentUserId),
            mergeMap(group => group.pipe(toArray()))
          ).subscribe((unReadMessagesGroup: UserMessage[]) => {
            from(this.firebasedb.unReadMessagesArray).pipe(
              every((item: UserMessage[]) => item[0].userId !== unReadMessagesGroup[0].userId)
            ).subscribe(newItem => {
              if (newItem) {
                this.firebasedb.unReadMessagesArray.push(unReadMessagesGroup);
                this.appService.setNotificationCount(this.firebasedb.unReadMessagesArray.length);
              }
            });
          });

          // from(messages).pipe(
          //   filter(filterMessage => filterMessage.isRead && filterMessage.userId !== this.currentUserId),
          //   groupBy(groupMessage => groupMessage.isRead && groupMessage.userId !== this.currentUserId),
          //   mergeMap(group => group.pipe(toArray()))
          // ).subscribe((readMessagesGroup: UserMessage[]) => {
          //   from(this.unReadMessagesArray).pipe(
          //     every((item: UserMessage[]) => item[0].userId !== readMessagesGroup[0].userId)
          //   ).subscribe((newItem) => {
          //     if (!newItem) {

          //     }
          //   });
          // });
        });
      });
    });

  }

  ngOnInit() {
  }

  tabsDidChange() {
    console.log(this.apptabs.getSelected());
  }



}
