import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from './service/messaging.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserMessage } from './model/message';
import { IonContent, IonInput, PopoverController, ModalController } from '@ionic/angular';
import { AppConstant } from '../shared/constant/app.constant';
import { OnlineUser } from './model/user';
import { MoreMenuPage } from './more-menu/more-menu.page';
import { AppService } from '../shared/services/app.service';
import { UserFriends } from '../shared/model/user-friend.model';
import { Observable, Subscription } from 'rxjs';
import { MessagingUserDetailsComponent } from './user-details/user-details.component';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit, OnDestroy {

  public messages: any = [];
  private friend: UserFriends;
  public queryInfo;
  private currentUserId: string;
  private messageSubscribe: any;
  // {to: string, toUserName: string, toProfileImagePath: string, from: string, fromUserName: string}
  public messageForm: FormGroup;
  public friendUserStatus: OnlineUser;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;
  @ViewChild('messageInput', { read: IonInput, static: false }) messageInput: IonInput;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private appConstant: AppConstant,
    private popoverCtrl: PopoverController,
    private appService: AppService,
    private modalController: ModalController) {
    this.route.queryParams.subscribe(params => {
      if (params && params.info) {
        this.setQueryinfo(params.info);
        // set user online
        this.messageService.setUserOnline(this.queryInfo.from);
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

        this.messageSubscribe = this.messageService.getMessages().subscribe((data: any) => {
          if (this.messages.length === 0) {
            this.messages = data;
            const unReadMessage = this.messages.filter((msg: any) => {
              return msg.payload.doc.data().isRead === false && msg.payload.doc.data().userId !== this.currentUserId;
            });
            if (unReadMessage && unReadMessage.length > 0) {
              unReadMessage.forEach((unreadmsg: any) => {
                this.messageService.updateMsg(unreadmsg.payload.doc.id);
              });
            }
          } else {
            if (this.messages.length < data.length) {
              if (this.currentUserId && data[this.messages.length].payload.doc.data().userId !== this.currentUserId) {
                this.messageService.updateMsg(data[this.messages.length].payload.doc.id);
              }
              this.messages.push(data[this.messages.length]);
            }
          }
          this.ionContent.scrollToBottom(50);
        });
      
      }
    });
    this.messageForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
     this.messageService.updateNotification({
      SenderId: this.queryInfo.to ,
      MessageTypeId: 1
    });
   
  }

  ngOnDestroy() {
    this.messageSubscribe.unsubscribe();
  }

  ionViewDidEnter() {
   
  }

  private setQueryinfo(queryInfo) {
    this.queryInfo = {
      ...JSON.parse(queryInfo)
    };
    // this.currentUserId = Object.assign({}, this.queryInfo).from.toString();
    this.queryInfo.firebaseCollection = (this.queryInfo.to > this.queryInfo.from) ?
      (this.queryInfo.from.toString() + '—' + this.queryInfo.to.toString())
      : (this.queryInfo.to.toString() + '—' + this.queryInfo.from.toString());

    this.queryInfo.toProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.queryInfo.toProfileImagePath + `?random=${Math.random()}`;
  }

  public onSubmit() {
    if (this.messageForm.value.message.length > 0) {
      const message: UserMessage = {
        userId: this.queryInfo.from,
        message: this.messageForm.value.message,
        datetime: new Date().toISOString(),
        isRead: false,
        readDateTime: ''
      };
      this.messageService.sendNotification({
        SenderName: this.queryInfo.fromUserName,
        Message: message.message,
        ReceiverUserId: this.queryInfo.to
      });
      message.message = this.messageService.aesEncrypt(message.message, message.userId);
      this.messageForm.reset();
      this.messageInput.setFocus();
      this.messageService.pushNewMsg(message).then(() => {
      }).catch((error) => {
        console.log(error);
      });
      this.ionContent.scrollToBottom(50);
    }
  }
  public getClasses(messageOwner?: string) {
    return {
      'incoming fadeInLeft': messageOwner !== this.queryInfo.from.toString(),
      'outgoing fadeInRight': messageOwner === this.queryInfo.from.toString(),
    };
  }

  public setdefultImage(event: any) {
    event.target.src = '/assets/no-image.png';
  }

  public onKey(event: any) {
    if (event.target.value.length > 0) {
      this.messageService.userTypingMessage(true);
    } else {
      this.messageService.userTypingMessage(false);
    }
  }
  public stopTyping() {
    this.messageService.userTypingMessage(false);
  }

  public checkFocus() {
    setTimeout(() => {
      this.ionContent.scrollToBottom(50);
    }, 500);
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
}


