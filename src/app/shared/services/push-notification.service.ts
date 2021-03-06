import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { PushDevice } from '../model/push-notification.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Toast } from '@ionic-native/toast/ngx';
import { reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private pushDevice = new BehaviorSubject<PushDevice>(null);

  public isUserFriendUpdated = new BehaviorSubject<boolean>(null);

  public isEventUpdated = new BehaviorSubject<boolean>(null);

  public getIsUserFriendUpdated(): Observable<boolean> {
    return this.isUserFriendUpdated.asObservable();
  }

  public setIsUserFriendUpdated(updateStatus: boolean) {
    this.isUserFriendUpdated.next(updateStatus);
  }

  public getIsEventUpdated(): Observable<boolean> {
    return this.isEventUpdated.asObservable();
  }

  public setIsEventUpdated(updateStatus: boolean) {
    this.isEventUpdated.next(updateStatus);
  }

  constructor(
    private push: Push,
    private platform: Platform,
    private toast: Toast,
    private alertCtrl: AlertController, private navCtrl: NavController) {
    this.platform.ready().then(() => {

      this.initPushNotification();
    });
  }

  public getPushDevice(): Observable<PushDevice> {
    return this.pushDevice.asObservable();
  }

  private setPushDevice(data) {
    this.pushDevice.next(data);
  }

  private initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '909966414988',
        sound: true,
        vibrate: true,
        icon: 'icon',
      },
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    // Delete a channel (Android O and above)
    // this.push.deleteChannel('bosahChannel').then(() => console.log('Channel deleted'));

    // Return a list of currently configured channels
    this.push.listChannels().then((channels) => {
      console.log('List of channels', channels);
    });

    this.push.createChannel({
      id: 'bosahChannel',
      description: 'bosah App Notification.',
      sound: 'pulse',
      vibration: true,
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 4
    }).then(() => console.log('Channel created'));

    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {

        switch (notification.additionalData.redirectAction) {

          // On receiving Events
          case '2': {
            this.setIsEventUpdated(true);
            // Update Events
            break;
          }
          // On receiving Friend Request
          case '3': {
            this.setIsUserFriendUpdated(true);
            // this.navCtrl.navigateForward('/tabs/match');
            break;
          }
          // On  Friend Request Accepted
          case '4': {
            this.setIsUserFriendUpdated(true);
            break;
          }
        }


      } else {
        this.platform.ready().then(() => {
          switch (notification.additionalData.redirectAction) {

            // On receiving Message
            case '1': {
              this.navCtrl.navigateForward('/tabs/match');
              break;
            }
            // On receiving Events
            case '2': {
              this.setIsEventUpdated(true);
              this.navCtrl.navigateForward('/events');
              break;
            }
            // On receiving Friend Request
            case '3': {
              this.setIsUserFriendUpdated(true);
              this.navCtrl.navigateForward('/tabs/match');
              break;
            }
            // On  Friend Request Accepted
            case '4': {
              this.setIsUserFriendUpdated(true);
              this.navCtrl.navigateForward('/tabs/match');
              break;
            }
          }
        });
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      this.setPushDevice(registration);
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}
