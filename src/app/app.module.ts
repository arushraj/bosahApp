import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

// Ionic Native
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { Facebook } from '@ionic-native/facebook/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

// In App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from './shared/services/app.service';
import { AppConstant } from './shared/constant/app.constant';
import { AppHttpService } from './shared/services/rest.service';
import { CustomPipesModule } from './shared/pipe/custom-pipe.module';
import { MessagingPageModule } from './messaging/messaging.module';
import { PushNotificationService } from './shared/services/push-notification.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    CustomPipesModule.forRoot(),
    MessagingPageModule
  ],
  providers: [
    HTTP,
    AppHttpService,
    StatusBar,
    SplashScreen,
    // GooglePlus,
    // Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppService,
    AppConstant,
    Toast,
    FormBuilder,
    Network,
    Camera,
    FilePath,
    WebView,
    File,
    Push,
    PushNotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private appService: AppService) { }
}
