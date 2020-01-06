import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private loadingController: LoadingController, private toastController: ToastController) { }

  public async presentToast(msg: any, duration: any, cssClass: any): Promise<any> {
    // debugger;
    const toast = await this.toastController.create({
      message: msg,
      duration,
      position: 'bottom',
      cssClass,
      color: 'dark'
    });

    // toast.onDidDismiss(() => {
    //   // Do something
    // });

    return toast.present();
  }

  public async presentLoading(msg, cssClass): Promise<any> {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
      cssClass
    });
    loading.present();

    // toast.onDidDismiss(() => {
    //   // Do something
    // });
    return loading.present();
  }


  public async dismissLoading(): Promise<any> {

    this.loadingController.dismiss();

  }


}
