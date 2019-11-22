import { Injectable } from '@angular/core';
import { LoadingController,ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private loadingController:LoadingController,private toastController:ToastController) { }

   public async presentToast(msg, duration, cssClass): Promise<any> {
      // debugger;
        let toast = await this.toastController.create({
          message: msg,
          duration: duration,
          position: 'bottom',
          cssClass: cssClass,
          color:"dark"
        });
    
        // toast.onDidDismiss(() => {
        //   // Do something
        // });
    
        return toast.present();
      }

      public async presentLoading(msg, cssClass): Promise<any> {
        let  loading = await this.loadingController.create({
          message: msg,
          translucent: true,
          cssClass: cssClass
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
