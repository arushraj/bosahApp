import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from './service/messaging.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserMessage } from './model/message';
import {
  IonContent,
  PopoverController,
  ModalController,
  IonTextarea,
  IonInfiniteScroll
} from '@ionic/angular';
import { AppConstant } from '../shared/constant/app.constant';
import { OnlineUser, UserTypingStatus } from './model/user';
import { MoreMenuPage } from './more-menu/more-menu.page';
import { AppService } from '../shared/services/app.service';
import { UserFriends } from '../shared/model/user-friend.model';
import { MessagingUserDetailsComponent } from './user-details/user-details.component';
import * as moment from 'moment';
import { findIndex, every, tap, filter, take } from 'rxjs/operators';
import { from, Subscription } from 'rxjs';
import { MessageTpe } from '../shared/enum/MessageType';
import { FirebasedbService } from '../shared/services/firebasedb.service';
import { Toast } from '@ionic-native/toast/ngx';

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
  private messagesSubscription: Subscription[] = [];
  private endBeforeDoc: any;
  private pageSize: number;
  private totalCollection = null;
  // {to: string, toUserName: string, toProfileImagePath: string, from: string, fromUserName: string}
  public messageForm: FormGroup;
  public friendUserStatus: OnlineUser;
  public friendTypingStatus: UserTypingStatus;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;
  @ViewChild('messageInput', { read: IonTextarea, static: true }) messageInput: IonTextarea;
  @ViewChild('ionInfiniteScroll', { read: IonInfiniteScroll, static: true }) ionInfiniteScroll: IonInfiniteScroll;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private appConstant: AppConstant,
    private popoverCtrl: PopoverController,
    private appService: AppService,
    private modalController: ModalController,
    private firebasedb: FirebasedbService,
    private toast: Toast) {
    this.route.queryParams.subscribe(params => {
      if (params && params.info) {
        this.setQueryinfo(params.info);
        this.messageService.subscribeMessageCollection(this.queryInfo.firebaseCollection);
        // set user online
        this.messageService.setUserOnline(this.queryInfo.fromUser);
        // get friend user status
        this.friendUserStatus = { isOnline: false, lastOnlineDateTime: null };
        this.friendTypingStatus = { isTyping: false };
        this.messagesSubscription.push(this.messageService.getFriendOnlineStatus(this.queryInfo.to).subscribe((data: OnlineUser) => {
          if (data) {
            this.friendUserStatus = data;
          }
        }));
        this.messagesSubscription.push(this.messageService.getFriendTypingStatus(this.queryInfo.to).subscribe((data: UserTypingStatus) => {
          if (data) {
            this.friendTypingStatus = data;
          }
        }));

        this.messagesSubscription.push(this.messageService.messagesValueChanges()
          .subscribe((totalMessages) => {
            if (totalMessages) {
              this.totalCollection = totalMessages.length;
              this.ionInfiniteScroll.disabled = this.totalCollection <= 25 ? true : false;

              if (this.messages.length === 0) {
                this.getMessages().then(() => {
                  this.ionContent.scrollToBottom(500);
                });
              }
            }
          }));

        this.messagesSubscription.push(this.appService.getUsersValueByKey('UserId').subscribe((value) => {
          this.currentUserId = value;
        }));

      }
    });
    this.messageForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

  private getMessages() {
    return new Promise((resolve, reject) => {
      if (this.messages.length < this.totalCollection) {
        this.endBeforeDoc = this.messages.length > 0 ? this.messages[0].document : '';
        this.pageSize = 25;
        this.messagesSubscription.push(this.messageService.getFriendMessages(this.endBeforeDoc, this.pageSize)
          .subscribe((data: UserMessage[]) => {
            if (data.length === 1 && data[0].type === 'added') {
              this.messages.push(...data);
              if (data[0].userId !== this.currentUserId) {
                setTimeout(() => {
                  this.ionContent.scrollToBottom(500);
                }, 500);
              }
            } else if (data.length === 1 && data[0].type === 'modified') {
              from(this.messages).pipe(
                findIndex(item => item.id === data[0].id)
              ).subscribe((index) => {
                this.messages[index].isRead = data[0].isRead;
                this.messages[index].readDateTime = data[0].readDateTime;
              }).unsubscribe();
            } else if (data.length > 1) {
              this.messages.unshift(...data);
            }

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
              }).unsubscribe();
            }).unsubscribe();
            resolve(true);
          }));
      } else {
        resolve(false);
      }
    });
  }

  ngOnDestroy() {
    this.messageService.setUserTypingMessageStatus(false, this.currentUserId);
    this.messagesSubscription.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }


  public loadData(event: any) {
    this.getMessages().then((status: boolean) => {
      if (!status) {
        event.target.disabled = true;
      } else {
        event.target.disabled = false;
      }
      event.target.complete();
    });
  }
  // public resize() {
  //   this.messageInput.nativeElement.style.height = this.messageInput.nativeElement.scrollHeight + 'px';
  // }


  ionViewDidEnter() {
    setTimeout(() => {
      this.ionContent.scrollToBottom(500);
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
      this.messageInput.setFocus();
      this.messageService.pushNewMsg(message).then(() => {
        setTimeout(() => {
          this.ionContent.scrollToBottom(500);
        }, 500);
      }).catch((error) => {
        console.log(error);
      });
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
    if (event.target.value.length > 0) {
      // this.messageInput.nativeElement.style.height = this.messageInput.nativeElement.scrollHeight + 'px';
      await this.messageService.setUserTypingMessageStatus(true, this.currentUserId);
    } else if (event.target.value.length === 0 || event.target.value == null) {
      await this.messageService.setUserTypingMessageStatus(false, this.currentUserId);
    }
  }
  public stopTyping() {
    this.messageService.setUserTypingMessageStatus(false, this.currentUserId);
  }

  public checkFocus() {
    setTimeout(() => {
      this.ionContent.scrollToBottom(500);
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


