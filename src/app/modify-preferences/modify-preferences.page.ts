import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public userForm: FormGroup;
  public rangeValue = { lower: 21, upper: 60 };
  public religions: UserReligion[];
  public pets: Pet[];
  public genders: Array<{ genderId: number, gender: string }> = [];
  public currentUser: CurrentUser;

  constructor(private appService: AppService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      preferredGender: ['', Validators.compose([Validators.required])],
      preferredReligion: ['', Validators.compose([Validators.required])],
      preferredPets: ['', Validators.compose([Validators.required])]
    });
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
        this.userForm.patchValue({
          preferredGender: this.currentUser.RoommatePreferences.GenderIds,
          preferredReligion: this.currentUser.RoommatePreferences.ReligionIds,
          preferredPets: this.currentUser.RoommatePreferences.PetIds,
        });
        this.rangeValue = { lower: this.currentUser.RoommatePreferences.MinAge, upper: this.currentUser.RoommatePreferences.MaxAge };
      }
    });
  }

  ngOnInit() {
  }

  public rangeChange(event) {
    this.rangeValue.lower = event.detail.value.lower;
    this.rangeValue.upper = event.detail.value.upper;
  }

  public submitForm() {
    const data = {
      UserId: this.currentUser.UserId,
      PreferredGenderIds: this.userForm.value.preferredGender.join(','),
      PreferredReligionIds: this.userForm.value.preferredReligion.join(','),
      PreferredPetIds: this.userForm.value.preferredPets.join(','),
      minAge: this.rangeValue.lower,
      maxAge: this.rangeValue.upper
    };
    this.appService.updateUser(data);
  }

}
