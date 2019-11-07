import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { CurrentUser } from '../../shared/model/current-user.model';
import { ActionSheetController, Platform, IonContent } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  public currentUser: CurrentUser;
  public ProfileImagePath: string;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;

  constructor(
    private appService: AppService,
    private toast: Toast,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private filePath: FilePath,
    private file: File,
    private webView: WebView) {
    this.appService.getCurrentUser()
      .subscribe(user => {
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
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.ionContent.scrollToTop(500);
    if (!this.currentUser.UserId) {
      this.appService.getCurrentuserFromDB();
    }
  }

  public userLogout() {
    this.appService.userLogout();
  }

  public doRefresh(event) {
    this.appService.getCurrentuserFromDB();
    event.target.complete();
  }

  public setdefultImage(event) {
    event.target.src = './assets/no-image.png';
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
    let correctPath;
    let currentName;
    let fileExtension;

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
    const newFileName = this.currentUser.FName.replace(' ', '_') + `_${new Date().getTime()}` + fileExtension;
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      const currentImagefilePath = this.webView.convertFileSrc(this.file.dataDirectory + newFileName);
      // this.toast.show(`Image: ${JSON.stringify(success)}`, `long`, 'bottom').subscribe(() => { });
      // this.currentUser.ProfileImagePath = currentImagefilePath;
      this.startUpload(this.file.dataDirectory + newFileName);
    }, error => {
      this.toast.show(`File Copy Error: ${JSON.stringify(error)}`, `short`, 'bottom').subscribe(() => { });
    });
  }

  private startUpload(imagePath) {
    this.appService.uploadProfileImage(imagePath, this.currentUser);
  }

}
