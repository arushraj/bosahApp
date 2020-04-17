import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AppService } from '../shared/services/app.service';
import { Toast } from '@ionic-native/toast/ngx';
import { FirebasedbService } from '../shared/services/firebasedb.service';
import { from } from 'rxjs';
import { filter, groupBy, mergeMap, toArray, find, first, every, findIndex, map } from 'rxjs/operators';
import { FriendshipStatus, UserFriends } from '../shared/model/user-friend.model';
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

    this.appService.getFriendList().subscribe((friends: UserFriends[]) => {
      from(friends).pipe(
        filter(friend => friend.Status === FriendshipStatus.Accepted),
      ).subscribe((myFriends: UserFriends) => {
        try {
          myFriends.LastMessage = null;
          this.firebasedb.subscribeLastMessageItem(myFriends.UserId, this.currentUserId).subscribe((messages) => {
            if (messages[0]) {
              messages[0].message = this.firebasedb.aesDecrypt(messages[0].message, messages[0].userId);
            }

            myFriends.LastMessage = messages.length > 0 ? messages[0] : null;
            this.firebasedb.setFirebaseFriends(friends);

            // Set default count for UnRead Message.
            myFriends.UnreadMessagesCount = 0;

            from(messages).pipe(
              filter(filterMessage => !filterMessage.isRead && filterMessage.userId !== this.currentUserId),
              groupBy(groupMessage => !groupMessage.isRead && groupMessage.userId !== this.currentUserId),
              mergeMap(group => group.pipe(toArray()))
            ).subscribe((unReadMessagesGroup: UserMessage[]) => {
              // Set the count of UnRead Message for a friend.
              myFriends.UnreadMessagesCount = unReadMessagesGroup.length;

              // Set the badge count of UnRead Message for all friends.
              from(this.firebasedb.unReadMessagesArray).pipe(
                every((item: UserMessage[]) => item[0].userId !== unReadMessagesGroup[0].userId)
              ).subscribe(newItem => {
                if (newItem) {
                  this.firebasedb.unReadMessagesArray.push(unReadMessagesGroup);
                  this.appService.setNotificationCount(this.firebasedb.unReadMessagesArray.length);
                }
              });
            });
          });
        } catch (ex) {
          console.log(ex);
        }
      });
      this.firebasedb.setFirebaseFriends(friends);
    });

  }

  ngOnInit() {
  }

  tabsDidChange() {
    console.log(this.apptabs.getSelected());
  }



}
