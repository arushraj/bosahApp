import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Platform, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private push: Push,
    public platform: Platform,
    private alertCtrl: AlertController) {
    this.platform.ready().then(() => {
      this.initPushNotification();
    });
  }

  initPushNotification() {
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
        senderID: '423137540298',
        sound: true,
        vibrate: true,
        icon: 'ic_launcher'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
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
      console.log('Received a notification', notification);
      if (notification.additionalData.foreground) {
      } else { }
    });

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}
