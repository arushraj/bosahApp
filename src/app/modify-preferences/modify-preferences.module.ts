import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModifyPreferencesPage } from './modify-preferences.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyPreferencesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModifyPreferencesPage]
})
export class ModifyPreferencesPageModule {}
