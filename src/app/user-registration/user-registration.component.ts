import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { CurrentUser } from '../shared/model/current-user.model';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit {

  public otpsend = false;
  private otp;
  private isValid = false;
  public newUser = {
    email: '',
    otp: '',
    referCode: '',
    firstName: '',
    lastName: '',
    phone: '',
    college: '',
    job: '',
    city: '',
    gender: '',
    roommateGender: '',
    userImage: './assets/male.png'
  };

  @ViewChild('registrationslides', { read: IonSlides, static: true }) registrationslides: IonSlides;

  constructor(
    private appService: AppService,
    private toast: Toast,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private filePath: FilePath,
    private file: File,
    private webView: WebView,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.registrationslides.lockSwipes(true).then(() => { });
  }

  public sendOTP() {
    if (this.newUser.email) {
      this.otp = Math.floor(1000 + Math.random() * 9000).toString();
      this.toast.show(`${this.otp}`, `short`, `bottom`).subscribe(() => { });
      this.otpsend = true;
    }
  }

  public reSendOTP() {
    this.toast.show(`${this.otp}`, `short`, `bottom`).subscribe(() => { });
  }

  public onKey(event: any) {
    // KeyboardEvent
    // this.toast.show(`${typeof (event.target.value)}`, `short`, `bottom`).subscribe(() => { });
    if (event.target.value.length === 4) {
      if (event.target.value !== this.otp) {
        this.toast.show(`You have entered the wrong otp password.`, `short`, `bottom`).subscribe(() => { });
      } else {
        this.newUser.otp = this.otp;
        this.isValid = true;
        event.target.blur();
        this.goToNext();
      }
    }
  }

  public goToNext() {
    this.registrationslides.lockSwipes(false).then(() => {
      this.registrationslides.slideNext(1000, true).then(() => {
        this.registrationslides.lockSwipes(true).then(() => { });
      });
    });
  }

  public setdefultImage(event: any) {
    event.target.src = './assets/male.png';
  }

  public async  selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      // {
      //   text: 'Use Camera',
      //   handler: () => {
      //     this.takePicture(this.camera.PictureSourceType.CAMERA);
      //   }
      // },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 25,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE
    };
    let correctPath: any;
    let currentName: any;
    let fileExtension: any;

    this.camera.getPicture(options).then((imagePath) => {
      // const base64Image = 'data:image/jpeg;base64,' + imagePath;
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            fileExtension = imagePath.substring(imagePath.lastIndexOf('.'), imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, fileExtension);
          }, (err) => {
            this.toast.show(`Fileerror: ${err}`, `long`, 'bottom').subscribe(() => { });
          });
      } else {
        currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        fileExtension = imagePath.substring(imagePath.lastIndexOf('.'), imagePath.lastIndexOf('?'));
        this.copyFileToLocalDir(correctPath, currentName, fileExtension);
      }
    }, (err) => {
      // Handle error
      this.toast.show(`error: ${err}`, `long`, 'bottom').subscribe(() => { });
    });
  }

  private copyFileToLocalDir(namePath, currentName, fileExtension) {
    const newFileName = this.newUser.firstName + `_${new Date().getTime()}` + fileExtension;
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      const currentImagefilePath = this.webView.convertFileSrc(this.file.dataDirectory + newFileName);
      // this.toast.show(`Image: ${JSON.stringify(success)}`, `long`, 'bottom').subscribe(() => { });
      this.newUser.userImage = currentImagefilePath;
      // this.newUser.userImage = this.file.dataDirectory + newFileName;
    }, error => {
      this.toast.show(`File Copy Error: ${JSON.stringify(error)}`, `short`, 'bottom').subscribe(() => { });
    });
  }
}
