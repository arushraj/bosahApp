import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private appService: AppService, private navCtrl: NavController) { }

  async ngOnInit() {
   // await this.appService.getNotificationCountFromDB();
    await this.appService.getCurrentUserIdfromLocalStorage()
      .then(value => {
        if (value !== null) {
          this.appService.getCurrentuserFromDB();
        
          this.navCtrl.navigateRoot('/tabs', { animated: true, animationDirection: 'forward' });
        } else {
          this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
        }
      })
      .catch((err) => {
        this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
      });
  }

  async ionViewWillEnter() {

  }

}
