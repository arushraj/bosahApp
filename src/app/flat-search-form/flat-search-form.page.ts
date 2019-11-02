import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';

// Models
import { UserLocation } from '../shared/model/location.model';
import { RentBudget } from '../shared/model/rent-budget.model';
import { Bedroom } from '../shared/model/bedroom.model';
import { Bathroom } from '../shared/model/bathroom.model';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-flat-search-form',
  templateUrl: './flat-search-form.page.html',
  styleUrls: ['./flat-search-form.page.scss'],
})
export class FlatSearchFormPage implements OnInit {

  public locations: UserLocation[];
  public rentBudget: RentBudget[];
  public bedrooms: Bedroom[];
  public bathrooms: Bathroom[];
  public userId: string;

  public userForm = {
    UserId: '',
    RentBudgetId: null,
    CityId: null,
    BedroomTypeId: null,
    BathroomTypeId: null,
    DesiredMoveInDate: null,
    Comments: null
  };

  constructor(private appService: AppService, private toast: Toast) {
    this.appService.getLocation().subscribe((locations) => {
      this.locations = locations;
    });
    this.appService.getRentBudget().subscribe((rentBudget) => {
      this.rentBudget = rentBudget;
    });
    this.appService.getBedrooms().subscribe((bedrooms) => {
      this.bedrooms = bedrooms;
    });
    this.appService.getBathrooms().subscribe((bathrooms) => {
      this.bathrooms = bathrooms;
    });
    this.appService.getUsersValueByKey('UserId').subscribe((value) => {
      this.userId = value;
    });
  }

  ngOnInit() {
  }

  public submitForm() {
    if (!this.userForm.CityId) {
      this.toast.showShortBottom('Please select a city.').subscribe(() => { });
      return;
    } else if (!this.userForm.RentBudgetId) {
      this.toast.showShortBottom('Please select your rent budget.').subscribe(() => { });
      return;
    } else if (!this.userForm.BedroomTypeId) {
      this.toast.showShortBottom('Please select bed room type.').subscribe(() => { });
      return;
    } else if (!this.userForm.BathroomTypeId) {
      this.toast.showShortBottom('Please select bath room type.').subscribe(() => { });
      return;
    } else if (!this.userForm.DesiredMoveInDate) {
      this.toast.showShortBottom('Please select desired move in date.').subscribe(() => { });
      return;
    }
    this.userForm.UserId = this.userId;
    this.appService.submitFlatSearchForm(this.userForm).then(() => {
      this.cleanForm();
    });
  }

  private cleanForm() {
    this.userForm = {
      UserId: '',
      RentBudgetId: null,
      CityId: null,
      BedroomTypeId: null,
      BathroomTypeId: null,
      DesiredMoveInDate: null,
      Comments: null
    };
  }
}
