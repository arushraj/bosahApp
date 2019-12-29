import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CurrentUser } from '../shared/model/current-user.model';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.page.html',
  styleUrls: ['./referrals.page.scss'],
})
export class ReferralsPage implements OnInit {

  public currentUser: CurrentUser;

  constructor(private socialSharing: SocialSharing, private appService: AppService) {
    this.appService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  public shareApp() {
    const shareObject: object = {
      message: `Hi, Checkout this Bosah app. perfect to find you ideal roomate and flat.` +
        ` Use my referral code ${this.currentUser.ReferralCode} to get a gift card.`,
      subject: `Sharing App`
    };
    this.socialSharing.shareWithOptions(shareObject)
      .then((data) => { console.log(data); })
      .catch((error) => { console.log(error); });
  }

}
