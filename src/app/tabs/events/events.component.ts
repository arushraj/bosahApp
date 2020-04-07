import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, IonRefresher } from '@ionic/angular';

import { AppService } from '../../shared/services/app.service';
import { Event } from '../../shared/model/event.model';
import { CurrentUser } from '../../shared/model/current-user.model';
import { UserLocation } from '../../shared/model/location.model';
import { EventDetailsComponent } from './event-details/event-details.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  private currentUser: CurrentUser;
  private locations: UserLocation[];
  public isLoading = false;
  // public events: Event[];
  private cityId: number;
  public pageTabs: Array<{ id: number, tabName: string, events: Event[] }>;
  public selectedTab: number;
  public slideOpts = {
    initialSlide: 0,
    speed: 300,
    cancelable: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  };
  @ViewChild('SwipedTabsEventsSlider', { read: IonSlides, static: true }) SwipedTabsEventsSlider: IonSlides;

  constructor(
    private appService: AppService,
    private modalController: ModalController) {

    this.pageTabs = [
      { id: 0, tabName: 'Upcoming Events', events: [] },
      { id: 1, tabName: 'Registered Events', events: [] }
    ];
    this.selectedTab = 0;

    this.appService.getLocation().subscribe((location) => {
      this.locations = location;
    });

    this.appService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser.UserId && this.locations.length > 0) {
        const obj = this.locations.find((item) => {
          return item.City === this.currentUser.City;
        });
        if (obj !== undefined) {
          this.cityId = obj.CityId;
        }
      }
    });

    this.appService.getUpcomingEvent().subscribe(events => {
      this.pageTabs[0].events = events;
      if (events.length > 0) {
        this.pageTabs[0].events.forEach((value, key) => {
          value.isSubscribe = false;
        });
      }
    });

    this.appService.getRegisteredEvent().subscribe(events => {
      this.pageTabs[1].events = events;
      if (events.length > 0) {
        this.pageTabs[1].events.forEach((value, key) => {
          value.isSubscribe = true;
        });
      }
    });

  }

  ngOnInit() { }

  currentSegment(index: number) {
    this.SwipedTabsEventsSlider.slideTo(index, 500).then(() => {
      this.getTabData().then(() => {
        this.isLoading = false;
      });
    });
  }

  currentSlide() {
    this.SwipedTabsEventsSlider.getActiveIndex().then(index => {
      this.selectedTab = index;
      this.getTabData().then(() => {
        this.isLoading = false;
      });
    });
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.currentSegment(this.pageTabs[0].id);
    this.selectedTab = this.pageTabs[0].id;
    this.getTabData(true).then(() => {
      this.isLoading = false;
    });
  }

  private getTabData(refreshData = false) {
    if (this.selectedTab === 0) {
      if (this.pageTabs[0].events.length === 0 || refreshData) {
        return this.appService.getUpcomingEventListFromDB(this.cityId, this.currentUser.UserId);
      }
    } else if (this.selectedTab === 1) {
      if (this.pageTabs[1].events.length === 0 || refreshData) {
        return this.appService.getRegisteredEventListFromDB(this.currentUser.UserId);
      }
    }
    return Promise.resolve();
  }

  public setdefultImage(event) {
    event.target.src = '/assets/no-image.png';
  }

  public async openDetails(event: Event) {
    if (event.EventImageFileName === undefined || event.EventImageFileName === null) {
      event.EventImageFileName = '';
    }
    const modal = await this.modalController.create({
      component: EventDetailsComponent,
      componentProps: { event, userId: this.currentUser.UserId }
    });
    return await modal.present();
  }

  public doRefresh(event: any) {
    this.getTabData(true).then(() => {
      event.target.complete();
    });
  }

}
