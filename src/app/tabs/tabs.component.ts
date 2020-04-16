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
    icon: 'star-outline',
    route: 'preferred',
    index:  0
  }, {
    name: 'Match',
    icon: '/assets/heart.svg',
    route: 'match',
    index:  1
  }, {
    name: 'Profile',
    icon: 'person-circle-outline',
    route: 'userprofile',
    index:  2
  },
  {
    name: 'Search',
    icon: 'search-circle-outline',
    route: 'flatsearchform',
    index:  3
  }
];
public badgeCount:number;
  // {
  //   name: 'Events',
  //   icon: 'calendar',
  //   route: 'events'
  // }


  @ViewChild('apptabs', { read: IonTabs, static: true }) apptabs: IonTabs;
  constructor(private appService: AppService, private toast: Toast) { 
 
    this.appService.getNotificationCount()
    .subscribe(count => {
      this.badgeCount = count;
    });
    
  }

  ngOnInit() {
   //this.appService.getNotificationCountFromDB();
   }

  tabsDidChange() {
    //this.appService.getNotificationCountFromDB();
    console.log(this.apptabs.getSelected());
  }



}
