import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { IonicModule } from '@ionic/angular';

import { MessagingPage } from './messaging.page';
import { MessageService } from './service/messaging.service';
import { DecryptTextBinderPipe } from './pipe/message-pipe';
import { MoreMenuPage } from './more-menu/more-menu.page';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CustomPipesModule } from '../shared/pipe/custom-pipe.module';

const routes: Routes = [
  {
    path: '',
    component: MessagingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    CustomPipesModule.forRoot()
  ],
  declarations: [MessagingPage, DecryptTextBinderPipe, MoreMenuPage, UserDetailsComponent],
  providers: [MessageService],
  entryComponents: [MoreMenuPage, UserDetailsComponent]
})
export class MessagingPageModule { }
