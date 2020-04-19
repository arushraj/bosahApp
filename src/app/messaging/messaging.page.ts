import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from './service/messaging.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserMessage } from './model/message';
import { IonContent, IonInput, PopoverController, ModalController, IonRefresher, IonTextarea } from '@ionic/angular';
import { AppConstant } from '../shared/constant/app.constant';
import { OnlineUser } from './model/user';
import { MoreMenuPage } from './more-menu/more-menu.page';
import { AppService } from '../shared/services/app.service';
import { UserFriends } from '../shared/model/user-friend.model';
import { MessagingUserDetailsComponent } from './user-details/user-details.component';
import * as moment from 'moment';
import { groupBy, mergeMap, toArray, map, findIndex, every, tap, filter } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { MessageTpe } from '../shared/enum/MessageType';
import { FirebasedbService } from '../shared/services/firebasedb.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit, OnDestroy {

  public messages: UserMessage[] = [];
  private friend: UserFriends;
  public queryInfo: any;
  public currentUserId: string;
  private messageSnapshotChangesSubscribe: any;
  private messageValueChangesSubscribe: any;
  private isTypingEnabled = false;
  // {to: string, toUserName: string, toProfileImagePath: string, from: string, fromUserName: string}
  public messageForm: FormGroup;
  public friendUserStatus: OnlineUser;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;
  @ViewChild('messageInput', { read: ElementRef, static: false }) messageInput: ElementRef;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private appConstant: AppConstant,
    private popoverCtrl: PopoverController,
    private appService: AppService,
    private modalController: ModalController,
    private firebasedb: FirebasedbService) {
    this.route.queryParams.subscribe(params => {
      if (params && params.info) {
        this.setQueryinfo(params.info);
        // set user online
        this.messageService.setUserOnline(this.queryInfo.fromUser);
        // get friend user status
        this.friendUserStatus = { isOnline: false, isTyping: false };
        this.messageService.getFriendUserStatus(this.queryInfo.to).subscribe((data: OnlineUser) => {
          if (data) {
            this.friendUserStatus = data;
          }
        });
        this.messageService.subscribeMessageCollection(this.queryInfo.firebaseCollection);

        this.appService.getUsersValueByKey('UserId').subscribe((value) => {
          this.currentUserId = value;
        });
        // Subscribe for Messages Data.
        this.messageSnapshotChangesSubscribe = this.messageService.getFriendMessages().subscribe((data: UserMessage[]) => {

          if (data[0].type === 'added') {
            this.messages.push(...data);
          } else if (data[0].type === 'modified') {
            this.messages[data[0].index.newIndex].isRead = data[0].isRead;
            this.messages[data[0].index.newIndex].readDateTime = data[0].readDateTime;
          }
          this.ionContent.scrollToBottom(50);

          from(this.messages).pipe(
            filter((msg: UserMessage) => msg.isRead === false && msg.userId !== this.currentUserId)
          ).subscribe((unReadMsg: UserMessage) => {
            if (unReadMsg && unReadMsg.id !== null) {
              this.messageService.updateMsg(unReadMsg.id);
            }
            // Update The Badge Count
            from(this.firebasedb.unReadMessagesArray).pipe(
              findIndex((item: UserMessage[]) => item[0].userId === this.queryInfo.to.toString())
            ).subscribe((index) => {
              if (index >= 0) {
                this.firebasedb.unReadMessagesArray.splice(index, 1);
                this.appService.setNotificationCount(this.firebasedb.unReadMessagesArray.length);
              }
            });
          });
        });

      }
    });
    this.messageForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.messageSnapshotChangesSubscribe.unsubscribe();
    // this.messageValueChangesSubscribe.unsubscribe();
  }

  public resize() {
    this.messageInput.nativeElement.style.height = this.messageInput.nativeElement.scrollHeight + 'px';
}

  public doRefresh(event: any) {
    event.target.complete();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.ionContent.scrollToBottom(50);
    }, 500);
  }

  private setQueryinfo(queryInfo) {
    this.queryInfo = {
      ...JSON.parse(queryInfo)
    };
    // this.currentUserId = Object.assign({}, this.queryInfo).from.toString();
    this.queryInfo.firebaseCollection = (this.queryInfo.to > this.queryInfo.fromUser) ?
      (this.queryInfo.fromUser.toString() + '—' + this.queryInfo.to.toString())
      : (this.queryInfo.to.toString() + '—' + this.queryInfo.fromUser.toString());

    this.queryInfo.toProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.queryInfo.toProfileImagePath + `?random=${Math.random()}`;
  }

  public async onSubmit() {
    if (this.messageForm.value.message.length > 0) {
      const message: UserMessage = {
        userId: this.queryInfo.fromUser,
        message: this.messageForm.value.message,
        datetime: new Date().toISOString(),
        isRead: false,
        readDateTime: ''
      };
      await this.messageService.sendNotification({
        SenderName: this.queryInfo.fromUserName,
        Message: message.message,
        ReceiverUserId: this.queryInfo.to
      });
      message.message = this.messageService.aesEncrypt(message.message, message.userId);
      this.messageForm.reset();
     // this.messageInput.setFocus();
      this.messageService.pushNewMsg(message).then(() => {
      }).catch((error) => {
        console.log(error);
      });
      this.ionContent.scrollToBottom(50);

    }
  }
  public getClasses(messageOwner?: string) {
    return {
      'incoming fadeInLeft': messageOwner !== this.queryInfo.fromUser.toString(),
      'outgoing fadeInRight': messageOwner === this.queryInfo.fromUser.toString(),
    };
  }

  public setdefultImage(event: any) {
    event.target.src = '/assets/no-image.png';
  }

  public async onKey(event: any) {
    if (event.target.value.length > 0 && !this.isTypingEnabled) {
      this.messageInput.nativeElement.style.height = this.messageInput.nativeElement.scrollHeight + 'px';
      await this.messageService.userTypingMessage(true);
      this.isTypingEnabled = true;
    } else if (event.target.value.length === 0 || event.target.value == null) {
      await this.messageService.userTypingMessage(false);
      this.isTypingEnabled = false;
    }
  }
  public stopTyping() {
    this.messageService.userTypingMessage(false);
  }

  public checkFocus() {
    setTimeout(() => {
      this.ionContent.scrollToBottom(50);
    }, 300);
  }

  public async openMoreOption(event: any) {
    this.appService.getFriendList().subscribe((friends) => {
      this.friend = friends.find(value => value.UserId === this.queryInfo.to);
    });
    const popover = await this.popoverCtrl.create({
      animated: true,
      backdropDismiss: true,
      componentProps: { friend: this.friend },
      component: MoreMenuPage,
      event,
      translucent: true
    });
    return popover.present();
  }

  public async profileView() {
    if (this.friend.ProfileImagePath === undefined || this.friend.ProfileImagePath === null) {
      this.friend.ProfileImagePath = '';
    }
    const modal = await this.modalController.create({
      component: MessagingUserDetailsComponent,
      componentProps: { user: this.friend, enableActionButton: false }
    });
    this.popoverCtrl.dismiss();
    return await modal.present();
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
          return `yesterday ${date.format('LT')}`;
        } else if (diffInDay > 1 && diffInDay <= 7) {
          return `${date.format('dddd')} ${date.format('LT')}`;
        } else if (diffInDay > 7) {
          return `${date.format('l')} ${date.format('LT')}`;
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

  public isNewGroup(index: number) {
    if (index > 0) {
      if (moment(this.messages[index - 1].datetime).format('L') === moment(this.messages[index].datetime).format('L')) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}


