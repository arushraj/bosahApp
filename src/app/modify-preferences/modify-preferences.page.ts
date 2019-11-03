import { Component, OnInit } from '@angular/core';

// Service
import { AppService } from '../shared/services/app.service';

// Model
import { UserReligion } from '../shared/model/religion.model';
import { Pet } from '../shared/model/pet.model';
import { CurrentUser } from '../shared/model/current-user.model';

@Component({
  selector: 'app-modify-preferences',
  templateUrl: './modify-preferences.page.html',
  styleUrls: ['./modify-preferences.page.scss'],
})
export class ModifyPreferencesPage implements OnInit {

  public userForm = {
    preferredGender: [],
    preferredReligion: [],
    preferredPets: [],
    minAge: 0,
    maxAge: 0
  };
  public rangeValue = { lower: 20, upper: 60 };
  public religions: UserReligion[];
  public pets: Pet[];
  public genders: Array<{ genderId: number, gender: string }> = [];
  public currentUser: CurrentUser;

  constructor(private appService: AppService) {
    this.genders = [{
      genderId: 1,
      gender: 'Male'
    }, {
      genderId: 2,
      gender: 'Female'
    }];
    this.appService.getReligion().subscribe(religions => { this.religions = religions; });
    this.appService.getPets().subscribe(pets => { this.pets = pets; });
    this.appService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (user.UserId) {
        this.userForm.preferredReligion = this.currentUser.RoommatePreferences.ReligionIds;
        this.userForm.preferredGender = this.currentUser.RoommatePreferences.GenderIds;
        this.userForm.preferredPets = this.currentUser.RoommatePreferences.PetIds;
        this.userForm.minAge = this.currentUser.RoommatePreferences.MinAge;
        this.userForm.maxAge = this.currentUser.RoommatePreferences.MaxAge;
        this.rangeValue = { lower: this.currentUser.RoommatePreferences.MinAge, upper: this.currentUser.RoommatePreferences.MaxAge };
      }
    });
  }

  ngOnInit() {
  }

  public rangeChange(event) {
    this.userForm.minAge = event.detail.value.lower;
    this.userForm.maxAge = event.detail.value.upper;
  }

  public submitForm() {
    const data = {
      UserId: this.currentUser.UserId,
      PreferredGenderIds: this.userForm.preferredGender.join(','),
      PreferredReligionIds: this.userForm.preferredReligion.join(','),
      PreferredPetIds: this.userForm.preferredPets.join(','),
      minAge: this.userForm.minAge,
      maxAge: this.userForm.maxAge
    };
    this.appService.updateUser(data);
  }

}
