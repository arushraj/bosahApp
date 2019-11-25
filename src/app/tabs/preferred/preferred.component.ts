import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { PreferredUser } from '../../shared/model/preferred-user.model';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';


@Component({
  selector: 'app-preferred',
  templateUrl: './preferred.component.html',
  styleUrls: ['./preferred.component.scss'],
})
export class PreferredComponent implements OnInit {

  public slideOpts = {
    initialSlide: 1,
    speed: 300,
    cancelable: true
  };
  public preferredUser: PreferredUser[];

  @ViewChild('preferredUserSlides', { read: IonSlides, static: true }) preferredUserSlides: IonSlides;

  constructor(
    private appService: AppService,
    private loadingController: LoadingController,
    private toast: Toast) {
    this.appService.getUserPreferred().subscribe((preferredUser) => {
      this.preferredUser = preferredUser;
    });
  }

  ngOnInit() {
    // this.appService.getUserPreferredFromDB();
  }

  ionViewDidEnter() {
    this.appService.getUserPreferredFromDB();
  }

  public setdefultImage(event) {
    event.target.src = '/assets/no-image.png';
  }

  public notIntrested() {
    this.preferredUserSlides.slideNext(1000, true).then(() => { });
  }

  public async sendFriendRequest(newFriend: PreferredUser) {
    this.appService.sendFriendRequest(newFriend);
  }

}
