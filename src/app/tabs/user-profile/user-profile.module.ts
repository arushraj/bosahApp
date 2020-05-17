import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { UserProfileComponent } from './user-profile.component';
import { CustomPipesModule } from '../../shared/pipe/custom-pipe.module';
import { MessagingUserDetailsComponent } from 'src/app/messaging/user-details/user-details.component';
import { MessagingPageModule } from 'src/app/messaging/messaging.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserProfileComponent
      }
    ]),
    CustomPipesModule.forRoot()
  ],
  declarations: [UserProfileComponent],
})
export class UserProfileModule { }
