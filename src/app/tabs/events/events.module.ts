import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomPipesModule } from '../../shared/pipe/custom-pipe.module';

import { EventsComponent } from './events.component';



@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: EventsComponent
      }
    ]),
    CustomPipesModule.forRoot()
  ]
})
export class EventsModule { }
