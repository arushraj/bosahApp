import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { CurrentUser, NewUser } from '../shared/model/current-user.model';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonSlides, IonRange } from '@ionic/angular';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit {

  public otpsend = false;
  private otp;
  private isValid = true;
  public displayImage = './assets/male.png';
  public newUser = {
    email: '',
    otp: '',
    referCode: '',
    firstName: '',
    lastName: '',
    age: null,
    phone: '',
    password: '',
    college: '',
    job: '',
    city: null,
    gender: null,
    preferredGender: [],
    religion: null,
    preferredReligion: [],
    userImage: ''
  };

  public locations;
  public religions;

  @ViewChild('agerange', { read: IonRange, static: true }) agerange: IonRange;
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

    this.appService.getLocation().subscribe(locations => {
      this.locations = locations;
    });
    this.appService.getReligion().subscribe(religions => {
      this.religions = religions;
    });
  }

  public async sendOTP() {
    if (this.newUser.email) {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: ''
      });
      loading.present();
      this.otp = Math.floor(1000 + Math.random() * 9000).toString();
      // this.toast.show(`${this.otp}`, `short`, `bottom`).subscribe(() => { });

      this.appService.sentotp(this.otp, this.newUser.email)
        .then(res => {
          const resData = JSON.parse(res.data);
          loading.dismiss();
          if (resData === 'Success') {
            this.otpsend = true;
          }
          this.toast.show(`${resData}`, `short`, `bottom`).subscribe(() => { });
        })
        .catch(err => {
          loading.dismiss();
          this.toast.show(`${JSON.stringify(err)}`, `short`, `bottom`).subscribe(() => { });
        });
    }
  }

  public reSendOTP() {
    // this.toast.show(`${this.otp}`, `short`, `bottom`).subscribe(() => { });
    this.sendOTP();
  }

  public registeredNewUser() {
    const user: NewUser = {
      FirstName: this.newUser.firstName,
      LastName: this.newUser.lastName,
      Password: this.newUser.password,
      EmailId: this.newUser.email,
      PhoneNumber: this.newUser.phone,
      College: this.newUser.college,
      Job: this.newUser.job,
      ProfileImagePath: this.newUser.userImage,
      GenderId: this.newUser.gender,
      ReligionId: this.newUser.religion,
      CityId: this.newUser.city,
      PreferredGenderIds: this.newUser.preferredGender.join(','),
      PreferredReligionIds: this.newUser.preferredReligion.join(','),
      Age: this.newUser.age,
      MaxAge: 20,
      MinAge: 30
    };
    this.appService.userRegistration(user);
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
        // this.agerange.value = { lower: 20, upper: 40 };
        this.registrationslides.lockSwipes(true).then(() => { });
      });
    });
  }

  public goToPrev() {
    this.registrationslides.lockSwipes(false).then(() => {
      this.registrationslides.slidePrev(1000, true).then(() => {
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
      this.displayImage = currentImagefilePath;
      this.newUser.userImage = this.file.dataDirectory + newFileName;
    }, error => {
      this.toast.show(`File Copy Error: ${JSON.stringify(error)}`, `short`, 'bottom').subscribe(() => { });
    });
  }
}
