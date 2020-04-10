import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { AppService } from '../shared/services/app.service';

// Models
import { UserLocation } from '../shared/model/location.model';
import { RentBudget } from '../shared/model/rent-budget.model';
import { Bedroom } from '../shared/model/bedroom.model';
import { Bathroom } from '../shared/model/bathroom.model';
import { Toast } from '@ionic-native/toast/ngx';
import { IonContent, AlertController } from '@ionic/angular';
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
  public rangeValue = { lower: 800, upper: 2000 };
  public selectedBedroomId: number;
  public selectedBathroomId: number;
  public minDate: string;
  public maxDate: string;
  @ViewChild('ionContent', { read: IonContent, static: true }) ionContent: IonContent;
  email: string;

  constructor(private appService: AppService, private toast: Toast, private fb: FormBuilder, private alertController: AlertController) {

    this.minDate = this.getmiStringDate();
    this.maxDate = this.getmaxStringDate();
    this.rangeValue.lower = 800;
    this.rangeValue.upper = 2000;
    this.userForm = this.fb.group({
      // RentBudgetId: ['', Validators.compose([Validators.required])],
      CityId: ['', Validators.compose([Validators.required])],
      // BedroomTypeId: ['', Validators.compose([Validators.required])],
      // BathroomTypeId: ['', Validators.compose([Validators.required])],
      DesiredMoveInDate: ['', Validators.compose([Validators.required])],
      Comments: [''],
      // roomrentRange: ['']
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
    this.appService.getCurrentUser()
      .subscribe(user => {
        this.email = user.EmailId;
      });

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.ionContent.scrollToTop(500);
  }

  private cleanForm() {
    this.userForm.reset();
    this.selectedBedroomId = null;
    this.selectedBathroomId = null;
  }

  public selectBedRoom(selectedBedRoom: number) {
    this.userForm.value.BedroomTypeId = selectedBedRoom;
    this.selectedBedroomId = selectedBedRoom;

  }

  public selectBathRoom(selectedBathroom: any) { 
    this.userForm.value.BathroomTypeId = selectedBathroom;
    this.selectedBathroomId = selectedBathroom;

  }

  public rangeChange(event) {
    this.rangeValue.lower = event.detail.value.lower;
    this.rangeValue.upper = event.detail.value.upper;
  }

  public getmiStringDate(): string {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  public getmaxStringDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear() + 1;
    return yyyy + '-' + mm + '-' + dd;
  }

  public async submitForm() {
    this.userForm.value.BedroomTypeId = this.selectedBedroomId == null ? 2 : this.selectedBedroomId;
    this.userForm.value.BathroomTypeId = this.selectedBathroomId == null ? 2 : this.selectedBathroomId;
    const data = Object.assign({}, this.userForm).value;
    data.minRentBudget = this.rangeValue.lower;
    data.maxRentBudget = this.rangeValue.upper;
    data.UserId = this.userId;
    this.appService.submitFlatSearchForm(data).then(async () => {
      this.cleanForm();
      const alert = await this.alertController.create({
        header: ``,
        mode:'ios',
        message: `Thanks for filling this form! We will send you a list of apartments to your registered email address:</strong><br/>` + this.email,
        buttons: ['Ok']
      });
      await alert.present();
    });


  }


}
