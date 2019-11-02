import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomPipesModule } from '../../shared/pipe/custom-pipe.module';

import { EventsComponent } from './events.component';
import { EventDetailsComponent } from './event-details/event-details.component';



@NgModule({
  declarations: [EventsComponent, EventDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: EventsComponent
      }
    ]),
    CustomPipesModule.forRoot()
  ],
  entryComponents: [EventDetailsComponent]
})
export class EventsModule { }
