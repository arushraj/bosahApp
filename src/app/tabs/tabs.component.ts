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
    name: 'Suggested',
    icon: 'star',
    route: 'preferred',
    index:  0
  }, {
    name: 'Match',
    icon: '/assets/heart.svg',
    route: 'match',
    index:  1
  }, {
    name: 'Profile',
    icon: 'Person',
    route: 'userprofile',
    index:  2
  },
  {
    name: 'Search',
    icon: 'Search',
    route: 'flatsearchform',
    index:  3
  }
];
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
