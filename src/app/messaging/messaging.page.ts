import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './service/messaging.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserMessage } from './model/message';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit, OnDestroy {

  public messages;
  public queryInfo;
  public messageForm: FormGroup;
  constructor(private messageService: MessageService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.info) {
        this.queryInfo = {
          ...JSON.parse(params.info)
        };
        this.queryInfo.firebaseCollection = (this.queryInfo.to > this.queryInfo.from) ?
          (this.queryInfo.from.toString() + this.queryInfo.to.toString())
          : (this.queryInfo.to.toString() + this.queryInfo.from.toString());

        this.messageService.subscribeCollection(this.queryInfo.firebaseCollection);
        this.messages = this.messageService.getMessages();
      }
    });
    this.messageForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() { }

  ionViewDidEnter() {

  }

  onSubmit() {
    const message: UserMessage = {
      userId: this.queryInfo.from,
      message: this.messageForm.value.message,
      datetime: new Date().toISOString()
    };
    this.messageForm.reset();
    this.messageService.pushNewMsg(message).then(() => {
    }).catch((error) => {
      console.log(error);
    });
  }
  getClasses(messageOwner?: string) {
    return {
      incoming: messageOwner !== this.queryInfo.from.toString(),
      outgoing: messageOwner === this.queryInfo.from.toString(),
    };
  }

}


