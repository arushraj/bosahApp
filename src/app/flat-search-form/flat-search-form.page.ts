import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
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
  public userForm: FormGroup;

  constructor(private appService: AppService, private toast: Toast, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      RentBudgetId: ['', Validators.compose([Validators.required])],
      CityId: ['', Validators.compose([Validators.required])],
      BedroomTypeId: ['', Validators.compose([Validators.required])],
      BathroomTypeId: ['', Validators.compose([Validators.required])],
      DesiredMoveInDate: ['', Validators.compose([Validators.required])],
      Comments: ['']
    });
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
    const data = this.userForm.value;
    data.UserId = this.userId;
    this.appService.submitFlatSearchForm(data).then(() => {
      this.cleanForm();
    });
  }

  private cleanForm() {
    this.userForm.reset();
  }
}
