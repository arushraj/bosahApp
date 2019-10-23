import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { Event } from '../../shared/model/event.model';
import { CurrentUser } from '../../shared/model/current-user.model';
import { UserLocation } from '../../shared/model/location.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  private currentUser: CurrentUser;
  private locations: UserLocation[];
  public events: Event[];
  private cityId: number;

  constructor(private appService: AppService) {
    this.appService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (this.locations) {
        this.locations.forEach((item) => {
          if (item.City === this.currentUser.City) {
            this.cityId = item.CityId;
          }
        });
      }
    });
    this.appService.getLocation().subscribe((location) => {
      this.locations = location;
      this.locations.forEach((item) => {
        if (item.City === this.currentUser.City) {
          this.cityId = item.CityId;
        }
      });
    });
    this.appService.getUpcomingEvent().subscribe(events => {
      this.events = events;
    });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.appService.getUpcomingEventListFromDB(this.cityId);
  }

  public setdefultImage(event) {
    event.target.src = '/assets/no-image.png';
  }
}
