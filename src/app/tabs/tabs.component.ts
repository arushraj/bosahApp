import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AppService } from '../shared/services/app.service';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  public tabs = [{
    name: 'Preferred',
    icon: 'star',
    route: 'preferred'
  }, {
    name: 'Match',
    icon: 'heart',
    route: 'match'
  }, {
    name: 'Profile',
    icon: 'person',
    route: 'userprofile'
  }];
  // {
  //   name: 'Events',
  //   icon: 'calendar',
  //   route: 'events'
  // }


  @ViewChild('apptabs', { read: IonTabs, static: true }) apptabs: IonTabs;
  constructor(private appService: AppService, private toast: Toast) { }

  ngOnInit() { }

  tabsDidChange() {
    console.log(this.apptabs.getSelected());
    // if (this.apptabs.getSelected() === 'preferred') {
    //   this.appService.getUserPreferredFromDB();
    // } else if (this.apptabs.getSelected() === 'match') {
    //   this.appService.getUserFriendsFromDB();
    // }
  }
}
