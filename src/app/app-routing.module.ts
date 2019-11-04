import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: './tabs/tabs.module#TabsModule',
    canActivate: [AuthGuard]
  }, {
    path: 'events',
    loadChildren: './tabs/events/events.module#EventsModule',
    canActivate: [AuthGuard]
  }, {
    path: 'flatsearchform',
    loadChildren: './flat-search-form/flat-search-form.module#FlatSearchFormPageModule',
    canActivate: [AuthGuard]
  }, {
    path: 'userlogin',
    loadChildren: './user-login/user-login.module#UserLoginModule'
  }, {
    path: 'userregistration',
    loadChildren: './user-registration/user-registration.module#UserRegistrationModule'
  }, {
    path: 'modifypreferences',
    loadChildren: './modify-preferences/modify-preferences.module#ModifyPreferencesPageModule'
  }, {
    path: 'profileupdate',
    loadChildren: './profile-update/profile-update.module#ProfileUpdatePageModule'
  }, {
    path: '**',
    redirectTo: 'userlogin',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
// Okay

