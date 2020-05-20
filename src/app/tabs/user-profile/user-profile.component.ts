import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { CurrentUser } from '../../shared/model/current-user.model';
import { ActionSheetController, Platform, IonContent, ModalController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppConstant } from 'src/app/shared/constant/app.constant';
import { MessagingUserDetailsComponent } from 'src/app/messaging/user-details/user-details.component';
import { UserFriends } from 'src/app/shared/model/user-friend.model';
import { Crop } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  public currentUser: CurrentUser;
  public ProfileImagePath: string;
  public lastImage: string;
  public userFriends: UserFriends;
  public selectedSmokingOptions:string;
  public selectedDrinkingOptions:string;
  public selectedPetsOptions:string;
  //profilePicsUploaded:boolean=false;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;

  constructor(
    private appService: AppService,
    private toast: Toast,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private filePath: FilePath,
    private file: File,
    private crop: Crop,
    private modalController: ModalController,
    private appConstant: AppConstant) {
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
          this.ProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.currentUser.ProfileImagePath ;
        }
      });  
   
  }

  ngOnInit() {
    //Added This to make sure User loaded from DB
    if (this.currentUser.ProfileImagePath === '' && this.currentUser.UserId) {
      //this.appService.currentUser.next();
      this.appService.getCurrentuserFromDB(true).then(user => {
      this.ProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.currentUser.ProfileImagePath +`?random=${Math.random()}`;
      });   
  }
    
   }

  ionViewDidEnter() {
    this.ionContent.scrollToTop(500);
    if (!this.currentUser.UserId)
    this.appService.getCurrentuserFromDB();

}

  public userLogout() {
    this.appService.userLogout();
  }

  public doRefresh(event) {
    this.appService.getCurrentuserFromDB(true).then(() => {
      event.target.complete();
    });
  }

  public setdefultImage(event) {
    event.target.src = './assets/no-image.png';
  }
//vinay
  // public async  selectImage() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Select Image source',
  //     buttons: [{
  //       text: 'Load from Library',
  //       handler: () => {
  //         this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     },

  //     {
  //       text: 'Cancel',
  //       role: 'cancel'
  //     }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 25,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true

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
        //for ios
        currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDirIOS(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      // Handle error
      this.toast.show(`error: ${err}`, `long`, 'bottom').subscribe(() => { });
    });
  }

  // Copy the image to a local folder
  private copyFileToLocalDirIOS(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, namePath, newFileName).then(copiedFile => {
      this.startUpload(copiedFile.nativeURL);
      this.ProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.currentUser.ProfileImagePath + `?random=${Math.random()}`;
      
      //this.lastImage = currentName;
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

  //For Android
  private copyFileToLocalDir(namePath, currentName, fileExtension) {
    const newFileName = this.currentUser.FName.replace(' ', '_') + `_${new Date().getTime()}` + fileExtension;
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.startUpload(this.file.dataDirectory + newFileName);
    }, error => {
      this.toast.show(`File Copy Error: ${JSON.stringify(error)}`, `short`, 'bottom').subscribe(() => { });
    });
  }

  //Service call to upload image via API
  private startUpload(imagePath) {
    this.appService.uploadProfileImage(imagePath, this.currentUser);
    //this.profilePicsUploaded= true;
    this.ProfileImagePath = this.appConstant.APP_IMG_BASE_URL + this.currentUser.ProfileImagePath + `?random=${Math.random()}`;
  
  }

  public async profileView() {
    this.appService.getsmokingOptions().subscribe(smoking => {
      this.selectedSmokingOptions=smoking.find(x=>x.Id === this.currentUser.SelectedSmokingId).Details;
    });

    this.appService.getdrinkingOptions().subscribe(drinking => {
      this.selectedDrinkingOptions=drinking.find(x=>x.Id===this.currentUser.SelectedDrinkingId).Details;

    });

    this.appService.getPets().subscribe(pets => {
      this.selectedPetsOptions=pets.find(x=>x.PetId === this.currentUser.SelectedPetId).PetName;
    });
    const user: UserFriends = {
      FName: this.currentUser.FName,
      Age: this.currentUser.Age,
      College: this.currentUser.College,
      Job: this.currentUser.Job,
      ProfileImagePath: this.currentUser.ProfileImagePath + `?random=${Math.random()}`,
      UserDrinking: this.selectedDrinkingOptions.trim().length === 2?'': this.selectedDrinkingOptions,
      UserId: this.currentUser.UserId,
      UserPet: this.selectedPetsOptions.trim().length === 2?'':this.selectedPetsOptions,
      UserSmoking: this.selectedSmokingOptions.trim().length === 2 ?'': this.selectedSmokingOptions,
      AboutMe: this.currentUser.AboutMe,
    };
    const modal = await this.modalController.create({
      component: MessagingUserDetailsComponent,
      componentProps: { user: user, enableActionButton: false }
    });
    //this.profilePicsUploaded=false;
    return await modal.present();
  }

  cropImage(fileUrl) {
    let correctPath;
    let currentName;
    let fileExtension;
    this.crop.crop(fileUrl, { quality: 50 })
    .then(
      
    newPath => {  
    currentName = newPath.substr(newPath.lastIndexOf('/') + 1);
    correctPath = newPath.substr(0, newPath.lastIndexOf('/') + 1);
    this.copyFileToLocalDirIOS(correctPath, currentName, this.createFileName());

    },
    error => {
    alert('Profile Picture not uploaded');
    }
    );
    }

    pickImage(sourceType) {
      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.cropImage(imageData)
      }, (err) => {
        // Handle error
      });
    }
  
    async selectImage() {
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        // {
        //   text: 'Use Camera',
        //   handler: () => {
        //     this.pickImage(this.camera.PictureSourceType.CAMERA);
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

}
