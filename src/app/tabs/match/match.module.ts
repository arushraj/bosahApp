import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { MatchComponent } from './match.component';
import { CustomPipesModule } from '../../shared/pipe/custom-pipe.module';


@NgModule({
  declarations: [MatchComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: MatchComponent
      }
    ]),
    CustomPipesModule.forRoot()
  ]
})
export class MatchModule { }
