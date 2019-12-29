import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'landing',
    loadChildren: './landing/landing.module#LandingPageModule'
  }, {
    path: 'userlogin',
    loadChildren: './user-login/user-login.module#UserLoginModule'
  }, {
    path: 'userregistration',
    loadChildren: './user-registration/user-registration.module#UserRegistrationModule'
  }, {
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
    path: 'modifypreferences',
    loadChildren: './modify-preferences/modify-preferences.module#ModifyPreferencesPageModule',
    canActivate: [AuthGuard]
  }, {
    path: 'profileupdate',
    loadChildren: './profile-update/profile-update.module#ProfileUpdatePageModule',
    canActivate: [AuthGuard]
  }, {
    path: 'forgetpassword',
    loadChildren: './forget-password/forget-password.module#ForgetPasswordPageModule'
  }, {
    path: 'messaging',
    loadChildren: './messaging/messaging.module#MessagingPageModule'
  }, {
    path: 'referrals',
    loadChildren: './referrals/referrals.module#ReferralsPageModule'
  }, {
    path: '**',
    redirectTo: 'landing',
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

