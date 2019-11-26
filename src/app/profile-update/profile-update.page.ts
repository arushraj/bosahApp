import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Service
import { AppService } from '../shared/services/app.service';
// Model
import { UserReligion } from '../shared/model/religion.model';
import { CurrentUser } from '../shared/model/current-user.model';
import { UserLocation } from '../shared/model/location.model';

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
  public currentUser: CurrentUser;
  public isActionCompleted:boolean = false;
 

  constructor(private fb: FormBuilder, private appService: AppService) {
    this.userForm = fb.group({
      // FirstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // LastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // EmailId: ['', Validators.compose([Validators.email])],
      // PhoneNumber: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      College: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      Job: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      AboutMe: ['', Validators.compose([Validators.maxLength(100)])],
      // dateofBirth: ['', Validators.compose([Validators.required])],
      GenderId: ['', Validators.compose([Validators.required])],
      ReligionId: ['', Validators.compose([Validators.required])],
      CityId: ['', Validators.compose([Validators.required])],
    });
    this.bindValues();
  }

  ngOnInit() {
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
      }
    });
  }

  public onSubmit() {
    //console.log(this.userForm);
    const data = Object.assign({}, this.userForm).value;
    data.UserId = this.currentUser.UserId;
    this.appService.updateUser(data).then(() => {
      this.userForm.reset();
      this.isActionCompleted = true;
    });
  }

}
