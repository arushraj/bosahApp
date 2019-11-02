import { Component, ViewChildren, QueryList } from '@angular/core';

import {
  Platform,
  ModalController,
  MenuController,
  ActionSheetController,
  PopoverController,
  NavController,
  IonRouterOutlet
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from './shared/services/app.service';
import { CurrentUser } from './shared/model/current-user.model';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // set up hardware back button event.
  private lastTimeBackPress = 0;
  private timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) main: QueryList<IonRouterOutlet>;
  public currentUser: CurrentUser;
  public ProfileImagePath: string;
  public appPages = [
    {
      title: 'Events',
      url: '/events',
      icon: 'calendar',
      routerDirection: 'forward'
    }, {
      title: 'Modify Preferences',
      url: '/',
      icon: 'construct',
      routerDirection: 'forward'
    }, {
      title: 'Search Request for flat',
      url: '/flatsearchform',
      icon: 'search',
      routerDirection: 'forward'
    }
    // {
    //   title: 'Preferred List',
    //   url: '/preferredprofile',
    //   icon: 'heart'
    // }, {
    //   title: 'User Login',
    //   url: 'userlogin',
    //   icon: 'person'
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private router: Router,
    private toast: Toast,
    private navCtrl: NavController,
    private appService: AppService,
    private loadingController: LoadingController) {
    this.initializeApp();
  }

  initializeApp() {
    this.appService.getCurrentUser().subscribe((user: CurrentUser) => {
      this.currentUser = user;
      if (this.currentUser.ProfileImagePath === '...' || this.currentUser.ProfileImagePath === '') {
        if (this.currentUser.GenderName === 'Female') {
          this.ProfileImagePath = './assets/female.png';
        } else if (this.currentUser.GenderName === 'Male') {
          this.ProfileImagePath = './assets/male.png';
        } else {
          this.ProfileImagePath = './assets/no-image.png';
        }
      } else {
        this.ProfileImagePath = this.currentUser.ProfileImagePath;
      }
    });

    // Initialize BackButton Eevent.
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backButtonEvent();

      // // call data from DB
      // this.appService.getCurrentuserFromDB();
      this.appService.getUserLocationsFromDB();
      this.appService.getUserReligionsFromDB();
      this.appService.getBathroomsFromDB();
      this.appService.getBedroomsFromDB();
      this.appService.getRentBudgetFromDB();
    });
  }

  // active hardware back button
  private backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      // close action sheet
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) { console.log(error); }

      // close popover
      try {
        const element = await this.popoverCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) { console.log(error); }

      // close modal
      try {
        const element = await this.modalCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) { console.log(error); }

      // close side menua
      try {
        const element = await this.menu.getOpen();
        if (element) {
          this.menu.close();
          return;
        }
      } catch (error) { console.log(error); return; }

      // try {
      //   const element = await this.loadingController.getTop();
      //   if (element) {
      //     return;
      //   }
      // } catch (error) { }

      // if (this.router.isActive('/tabs/match', true)
      //   || this.router.isActive('/tabs/preferred', true)
      //   || this.router.isActive('/tabs/userprofile', true)) {
      //   if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
      //     // this.platform.exitApp(); // Exit from app
      //     // tslint:disable-next-line:no-string-literal
      //     navigator['app'].exitApp(); // work for ionic 4

      //   } else {
      //     this.toast.show(
      //       `Press back again to exit App.`,
      //       '2000',
      //       'bottom')
      //       .subscribe(toast => {
      //         // console.log(JSON.stringify(toast));
      //       });
      //     this.lastTimeBackPress = new Date().getTime();
      //   }
      // } else {
      //   // this.navCtrl.back({ animated: true, animationDirection: 'back' });
      //   this.router.navigate([this.previousUrl]);
      // }

      this.main.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          // outlet.pop();
        } else if (this.router.isActive('/tabs/match', true)
          || this.router.isActive('/tabs/preferred', true)
          || this.router.isActive('/tabs/events', true)) {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            // this.platform.exitApp(); // Exit from app
            // tslint:disable-next-line:no-string-literal
            navigator['app'].exitApp(); // work for ionic 4

          } else {
            this.toast.show(
              `Press back again to exit App.`,
              'short',
              'bottom')
              .subscribe(toast => {
                // console.log(JSON.stringify(toast));
              });
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });

    });
  }

  public setdefultImage(event) {
    event.target.src = './assets/no-image.png';
  }

  public userLogout() {
    this.appService.userLogout();
  }
}
