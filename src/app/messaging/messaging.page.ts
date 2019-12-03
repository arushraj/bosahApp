import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from './service/messaging.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserMessage } from './model/message';
import { IonContent, IonInput } from '@ionic/angular';
import { AppConstant } from '../shared/constant/app.constant';
import { OnlineUser } from './model/user';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit, OnDestroy {

  public messages: UserMessage[] = [];
  public queryInfo;
  // {to: string, toUserName: string, toProfileImagePath: string, from: string, fromUserName: string}
  public messageForm: FormGroup;
  public friendUserStatus: OnlineUser;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;
  @ViewChild('messageInput', { read: IonInput, static: false }) messageInput: IonInput;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private appConstant: AppConstant) {
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
        this.messageService.getMessages().subscribe((data) => {
          if (this.messages.length === 0) {
            this.messages = data;
          } else {
            if (this.messages.length < data.length) {
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
  }

  ngOnDestroy() {
  }

  ionViewDidEnter() {
  }

  private setQueryinfo(queryInfo) {
    this.queryInfo = {
      ...JSON.parse(queryInfo)
    };
    this.queryInfo.firebaseCollection = (this.queryInfo.to > this.queryInfo.from) ?
      (this.queryInfo.from.toString() + '—' + this.queryInfo.to.toString())
      : (this.queryInfo.to.toString() + '—' + this.queryInfo.from.toString());

    this.queryInfo.toProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.queryInfo.toProfileImagePath + `?random=${Math.random()}`;
  }

  public onSubmit() {
    const message: UserMessage = {
      userId: this.queryInfo.from,
      message: this.messageForm.value.message,
      datetime: new Date().toISOString()
    };
    message.message = this.messageService.aesEncrypt(message.message, message.userId);
    this.messageForm.reset();
    this.messageInput.setFocus();
    this.messageService.pushNewMsg(message).then(() => {
    }).catch((error) => {
      console.log(error);
    });
    this.ionContent.scrollToBottom(50);
  }
  public getClasses(messageOwner?: string) {
    return {
      'incoming fadeInLeft': messageOwner !== this.queryInfo.from.toString(),
      'outgoing fadeInRight': messageOwner === this.queryInfo.from.toString(),
    };
  }

  public setdefultImage(event) {
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

}


