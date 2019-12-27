import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { MatchComponent } from './match.component';
import { CustomPipesModule } from '../../shared/pipe/custom-pipe.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserMoreMenuPage } from './user-more-menu/user-more-menu.page';


@NgModule({
  declarations: [MatchComponent, UserDetailsComponent, UserMoreMenuPage],
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
  ],
  entryComponents: [UserDetailsComponent, UserMoreMenuPage]
})
export class MatchModule { }
