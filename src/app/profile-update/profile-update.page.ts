import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Service
import { AppService } from '../shared/services/app.service';
// Model
import { UserReligion } from '../shared/model/religion.model';
import { CurrentUser } from '../shared/model/current-user.model';
import { UserLocation } from '../shared/model/location.model';
import { PreferredGiftCards } from '../shared/model/preferredGiftCards.model';
import { Drinking } from '../shared/model/drinking.model';
import { Smoking } from '../shared/model/smoking.model';
import { Pet } from '../shared/model/pet.model';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.page.html',
  styleUrls: ['./profile-update.page.scss'],
})
export class ProfileUpdatePage implements OnInit {

  public userForm: FormGroup;
  public genders: Array<{ genderId: number, gender: string }> = [];
  public religions: UserReligion[];
  public locations: UserLocation[];
  public giftCard: PreferredGiftCards[];
  public DrinkingOptions: Drinking[];
  public SmokingOptions: Smoking[];
  public petsOptions: Pet[];
  public currentUser: CurrentUser;
  public isActionCompleted: boolean;
  @ViewChild('aboutMe',{static: true}) myInput: ElementRef;
  //@ViewChild('aboutMe', { read: IonTextarea, static: true }) ionContent: IonTextarea;


  constructor(private fb: FormBuilder, private appService: AppService) {
    this.userForm = fb.group({
      // FirstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // LastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      EmailId: ['', Validators.compose([Validators.email])],
      PhoneNumber: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      College: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      Job: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      AboutMe: ['', Validators.compose([Validators.maxLength(100)])],
      // dateofBirth: ['', Validators.compose([Validators.required])],
      GenderId: ['', Validators.compose([Validators.required])],
      ReligionId: ['', Validators.compose([Validators.required])],
      CityId: ['', Validators.compose([Validators.required])],
      SelectedGiftCardTypeID: [''],
      UserSelectedSmokingId: ['', Validators.compose([Validators.required])],
      UserSelectedDrinkingId: ['', Validators.compose([Validators.required])],
      UserSelectedPetId: ['', Validators.compose([Validators.required])]
    });
    this.bindValues();
  }

  ngOnInit() {
  }

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
}

  private bindValues() {
    this.genders = [{
      genderId: 1,
      gender: 'Male'
    }, {
      genderId: 2,
      gender: 'Female'
    }];
    this.appService.getReligion().subscribe(religions => {
      this.religions = religions;
      if (religions.length > 0 && (this.currentUser && this.currentUser.Religion)) {
        this.userForm.patchValue({
          ReligionId: this.religions.find(item => {
            return item.Religion === this.currentUser.Religion;
          }).ReligionId
        });
      }
    });
    this.appService.getLocation().subscribe(locations => {
      this.locations = locations;
      if (locations.length > 0 && (this.currentUser && this.currentUser.City)) {
        this.userForm.patchValue({
          CityId: this.locations.find(item => {
            return item.City === this.currentUser.City;
          }).CityId
        });
      }
    });
    this.appService.getPreferredGiftcards().subscribe((gift) => {
      this.giftCard = gift;
      if (gift.length > 0 && (this.currentUser && this.currentUser.SelectedGiftCardID)) {
        this.userForm.patchValue({
          SelectedGiftCardTypeID: this.giftCard.find(item => {
            return item.GiftCardTypeID === this.currentUser.SelectedGiftCardID;
          }).GiftCardTypeID
        });
      }
    });
    this.appService.getdrinkingOptions().subscribe((drinkoptions) => {
      this.DrinkingOptions = drinkoptions;
      if (drinkoptions.length > 0 && (this.currentUser && this.currentUser.SelectedDrinkingId)) {
        this.userForm.patchValue({
          UserSelectedDrinkingId: this.DrinkingOptions.find(item => {
            return item.Id === this.currentUser.SelectedDrinkingId;
          }).Id
        });
      }
    });
    this.appService.getsmokingOptions().subscribe((smokingoptions) => {
      this.SmokingOptions = smokingoptions;
      if (smokingoptions.length > 0 && (this.currentUser && this.currentUser.SelectedSmokingId)) {
        this.userForm.patchValue({
          UserSelectedSmokingId: this.SmokingOptions.find(item => {
            return item.Id === this.currentUser.SelectedDrinkingId;
          }).Id
        });
      }
    });
    this.appService.getPets().subscribe((options) => {
      this.petsOptions = options;
      if (options.length > 0 && (this.currentUser && this.currentUser.SelectedPetId)) {
        this.userForm.patchValue({
          UserSelectedPetId: this.petsOptions.find(item => {
            return item.PetId === this.currentUser.SelectedPetId;
          }).PetId
        });
      }
    });
    this.appService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (user.UserId) {
        this.userForm.patchValue({
          FirstName: this.currentUser.FName,
          LastName: this.currentUser.LName,
          EmailId: this.currentUser.EmailId,
          PhoneNumber: this.currentUser.PhoneNumber,
          College: this.currentUser.College,
          Job: this.currentUser.Job,
          AboutMe: this.currentUser.AboutMe,
          dateofBirth: this.currentUser.DOB.split('T')[0],
          GenderId: this.genders.find(item => {
            return item.gender === this.currentUser.GenderName;
          }).genderId
        });
        if (this.religions.length > 0) {
          const oldReligion = this.religions.find(item => {
            return item.Religion === this.currentUser.Religion;
          });
          if (oldReligion !== undefined) {
            this.userForm.patchValue({
              ReligionId: oldReligion.ReligionId
            });
          }
        }
        if (this.locations.length > 0) {
          const oldLocation = this.locations.find(item => {
            return item.City === this.currentUser.City;
          });
          if (oldLocation !== undefined) {
            this.userForm.patchValue({
              CityId: oldLocation.CityId
            });
          }
        }
        if (this.giftCard.length > 0) {
          const oldgift = this.giftCard.find(item => {
            return item.GiftCardTypeID === this.currentUser.SelectedGiftCardID;
          });
          if (oldgift !== undefined) {
            this.userForm.patchValue({
              SelectedGiftCardTypeID: oldgift.GiftCardTypeID
            });
          }
        }
        if (this.DrinkingOptions.length > 0) {
          const option = this.DrinkingOptions.find(item => {
            return item.Id === this.currentUser.SelectedDrinkingId;
          });
          if (option !== undefined) {
            this.userForm.patchValue({
              UserSelectedDrinkingId: option.Id
            });
          }
        }
        if (this.SmokingOptions.length > 0) {
          const option = this.SmokingOptions.find(item => {
            return item.Id === this.currentUser.SelectedSmokingId;
          });
          if (option !== undefined) {
            this.userForm.patchValue({
              UserSelectedSmokingId: option.Id
            });
          }
        }
        if (this.petsOptions.length > 0) {
          const option = this.petsOptions.find(item => {
            return item.PetId === this.currentUser.SelectedPetId;
          });
          if (option !== undefined) {
            this.userForm.patchValue({
              UserSelectedPetId: option.PetId
            });
          }
        }
      }
    });
  }

  public onSubmit() {
    const data = Object.assign({}, this.userForm).value;
    data.UserId = this.currentUser.UserId;
    this.appService.updateUser(data).then(() => {
      this.userForm.reset();
      this.isActionCompleted = true;
    });
  }

}
