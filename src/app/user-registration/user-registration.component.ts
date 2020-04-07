import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { NewUser } from '../shared/model/current-user.model';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonSlides, IonRange } from '@ionic/angular';

import { UserLocation } from '../shared/model/location.model';
import { UserReligion } from '../shared/model/religion.model';
import { Pet } from '../shared/model/pet.model';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';
import { Smoking } from '../shared/model/smoking.model';
import { Drinking } from '../shared/model/drinking.model';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit, AfterViewInit {

  public lastImage: string;
  public otpsend = false;
  private otp;
  public isValid = false;
  private isBackbuttonDisabled = false;
  public displayImage = '/assets/no-image.png';
  public minDate: string;
  public maxDate: string;
  public newUser = {
    email: '',
    otp: '',
    referCode: '',
    firstName: '',
    lastName: '',
    age: null,
    dob: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college: '',
    job: '',
    city: null,
    gender: null,
    preferredGender: [],
    religion: null,
    preferredReligion: [],
    userImage: '',
    minAge: 21,
    maxAge: 60,
    aboutMe: '',
    preferredPets: [],
    UserPetId: 4,
    UserDrinkingID: 6,
    UserSmokingId: 4
  };
  public userAcceptTermsAndConditions = false;

  public locations: UserLocation[];
  public religions: UserReligion[];
  public pets: Pet[];
  public smokingOptions: Smoking[];
  public drinkingOptions: Drinking[];
  // public passwordRegex:RegExp;
  public signaturePadOptions = {
    minWidth: 2,
    canvasWidth: 500,
    canvasHeight: 300
  };
  public signatureImage: string;
  private emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
  private passwordRegex: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  private isValidEmail = true;
  public otpForm: FormGroup;
  public passwordForm: FormGroup;
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
    private loadingController: LoadingController,
    private fb: FormBuilder) {
    this.minDate = this.getmiStringDate();
    this.maxDate = this.getmaxStringDate();

    this.otpForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmPassword: ['', Validators.compose([Validators.required])]
    }, {
      validators: this.mustMatchPassword('password', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.registrationslides.lockSwipes(true).then(() => { });

    this.appService.getLocation().subscribe((locations: UserLocation[]) => {
      this.locations = locations;
    });
    this.appService.getReligion().subscribe((religions: UserReligion[]) => {
      this.religions = religions;
    });
    this.appService.getPets().subscribe((pets: Pet[]) => {
      this.pets = pets;
    });

    this.appService.getdrinkingOptions().subscribe((drinkingOptions: Drinking[]) => {
      this.drinkingOptions = drinkingOptions;
    });

    this.appService.getsmokingOptions().subscribe((smokingOptions: Smoking[]) => {
      this.smokingOptions = smokingOptions;
    });
  }


  private mustMatchPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngAfterViewInit() {
  }

  public rangeChange(event) {
    this.newUser.minAge = event.detail.value.lower;
    this.newUser.maxAge = event.detail.value.upper;
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

      this.appService.sentotp(this.otp, this.newUser.email, 0)
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
    if (this.newUser.preferredGender.length === 0) {
      this.toast.showShortBottom('Please select preferred genders for your roommate.').subscribe(() => { });
      return;
    } else if (this.newUser.preferredReligion.length === 0) {
      this.toast.showShortBottom('Please select preferred religions for your roommate.').subscribe(() => { });
      return;
    } else if (this.newUser.preferredPets.length === 0) {
      this.toast.showShortBottom('Please select preferred pets for your roommate.').subscribe(() => { });
      return;
    } else if (!this.userAcceptTermsAndConditions) {
      this.toast.showShortBottom('Please accept the terms and conditions.').subscribe(() => { });
      return;
    }
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
      DOB: this.newUser.dob,
      MinAge: this.newUser.minAge,
      MaxAge: this.newUser.maxAge,
      UsedReferralCode: this.newUser.referCode,
      AboutMe: this.newUser.aboutMe,
      PreferredPetIds: this.newUser.preferredPets.join(','),
      UserSelectedPetId: this.newUser.UserPetId,
      UserSelectedSmokingId: this.newUser.UserSmokingId,
      UserSelectedDrinkingId: this.newUser.UserDrinkingID
    };

    this.appService.userRegistration(user);
  }

  public onKey(event: any) {
    // KeyboardEvent
    // this.toast.show(`${typeof (event.target.value)}`, `short`, `bottom`).subscribe(() => { });
    if (event.target.value.length === 4) {
      if (event.target.value !== this.otp) {
        this.toast.show(`You have entered the wrong code.`, `short`, `bottom`).subscribe(() => { });
      } else {
        this.newUser.otp = this.otp;
        this.isValid = true;
        event.target.blur();
        this.isBackbuttonDisabled = true;
        this.goToNext();
      }
    }
  }

  public async checkReferralCode() {
    if (this.newUser.referCode) {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: ''
      });
      loading.present();
      this.appService.checkValidReferralCode(this.newUser.referCode)
        .then((res) => {
          const resData = JSON.parse(res.data);
          if (!resData.Status) {
            this.toast.showShortBottom(resData.ResponseMessage).subscribe(() => { });
            this.newUser.referCode = '';
            return;
          } else {
            this.registrationslides.lockSwipes(false).then(() => {
              this.registrationslides.slideNext(1000, true).then(() => {
                this.registrationslides.lockSwipes(true).then(() => { });
              });
            });
          }
        })
        .catch((error) => {
          const resData = JSON.parse(error.error);
          if (!resData.Status) {
            this.toast.showShortBottom(`${error.message || resData.ResponseMessage}`).subscribe(() => { });
            this.newUser.referCode = '';
            return;
          } else {
            this.registrationslides.lockSwipes(false).then(() => {
              this.registrationslides.slideNext(1000, true).then(() => {
                this.registrationslides.lockSwipes(true).then(() => { });
              });
            });
          }
        })
        .finally(() => { loading.dismiss(); });
    } else {
      this.registrationslides.lockSwipes(false).then(() => {
        this.registrationslides.slideNext(1000, true).then(() => {
          this.registrationslides.lockSwipes(true).then(() => { });
        });
      });
    }
  }

  public goToNext() {
    this.registrationslides.getActiveIndex().then(index => {
      if (index === 2) {
        /*vinay*/
        // this.passwordRegex= new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
        if (!this.newUser.password) {
          this.toast.showShortBottom('Please enter your password.').subscribe(() => { });
          return;
        } else if (!this.passwordRegex.test(this.newUser.password)) {
          this.toast.showShortBottom('Password Must contain one capital,small,number and special character').subscribe(() => { });
          return;
        } else if (this.newUser.password !== this.newUser.confirmPassword) {
          this.toast.showShortBottom('Password mismatching with confirm password.').subscribe(() => { });
          return;
        }
      } else if (index === 3) {
        if (!this.newUser.firstName) {
          this.toast.showShortBottom('Please enter your first name.').subscribe(() => { });
          return;
        } else if (!this.newUser.lastName) {
          this.toast.showShortBottom('Please enter your last name.').subscribe(() => { });
          return;
        } else if (!this.newUser.phone) {
          this.toast.showShortBottom('Please enter your contact number.').subscribe(() => { });
          return;
        } else if (!this.newUser.dob) {

          this.toast.showShortBottom('Please enter your date of birth.').subscribe(() => { });
          return;
        } else if (this.newUser.dob) {
          const bdate = new Date(this.newUser.dob);
          const timeDiff = Math.abs(Date.now() - bdate.getTime());
          const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
          if (age < 21) {
            this.toast.showShortBottom('Minimum Age to use this platform is 21').subscribe(() => { });
            return;
          }

        }
      } else if (index === 4) {
        if (!this.newUser.college) {
          this.toast.showShortBottom('Please enter your Education Details').subscribe(() => { });
          return;
        } else if (!this.newUser.job) {
          this.toast.showShortBottom('Please enter your job title.').subscribe(() => { });
          return;
        } else if (!this.newUser.city) {
          this.toast.showShortBottom('Please select your city.').subscribe(() => { });
          return;
        } else if (!this.newUser.gender) {
          this.toast.showShortBottom('Please select your Gender.').subscribe(() => { });
          return;
        } else if (!this.newUser.religion) {
          this.toast.showShortBottom('Please select your Religion.').subscribe(() => { });
          return;
        }
      }
      this.registrationslides.lockSwipes(false).then(() => {
        this.registrationslides.slideNext(1000, true).then(() => {
          this.registrationslides.lockSwipes(true).then(() => { });
        });
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
    event.target.src = '/assets/no-image.png';
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
        this.displayImage = correctPath + currentName;
        this.copyFileToLocalDirIOS(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      // Handle error
      this.toast.show(`error: ${err}`, `long`, 'bottom').subscribe(() => { });
    });
  }

  // Copy the image to a local folder of IOS Devices
  private copyFileToLocalDirIOS(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      // this.startUpload(this.file.dataDirectory + newFileName);
      const currentImagefilePath = this.webView.convertFileSrc(this.file.dataDirectory + newFileName);
      // this.toast.show(`Image: ${JSON.stringify(success)}`, `long`, 'bottom').subscribe(() => { });
      this.displayImage = currentImagefilePath;
      this.lastImage = newFileName;
      this.newUser.userImage = this.file.dataDirectory + newFileName;
    }, error => {
      this.toast.show(`File Copy Error: ${JSON.stringify(error)}`, `short`, 'bottom').subscribe(() => { });
    });
  }

  // Create a new name for the image
  private createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, fileExtension) {
    const newFileName = this.newUser.firstName.replace(' ', '_') + `_${new Date().getTime()}` + fileExtension;
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      const currentImagefilePath = this.webView.convertFileSrc(this.file.dataDirectory + newFileName);
      // this.toast.show(`Image: ${JSON.stringify(success)}`, `long`, 'bottom').subscribe(() => { });
      this.displayImage = currentImagefilePath;
      this.newUser.userImage = this.file.dataDirectory + newFileName;
    }, error => {
      this.toast.show(`File Copy Error: ${JSON.stringify(error)}`, `short`, 'bottom').subscribe(() => { });
    });
  }

  public openLink(urlNumber:number) { 
   switch(urlNumber) { 
    case 1: { 
      window.location.assign('http://thebosahapp.com/terms-conditions/');
       break; 
    } 
    case 2: { 
      window.location.assign('http://thebosahapp.com/privacy-policy/');
       break; 
    } 
    case 3: { 
      window.location.assign('http://thebosahapp.com/information-about-broker-services/');
       break; 
    } 
 } 
  }

  public getmiStringDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear() - 70;
    return yyyy + '-' + mm + '-' + dd;
  }

  public getmaxStringDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear() - 21;
    return yyyy + '-' + mm + '-' + dd;
  }

}
