import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule),
    canActivate: [AuthGuard]
  }, {
    path: 'events',
    loadChildren: () => import('./tabs/events/events.module').then(m => m.EventsModule),
    canActivate: [AuthGuard]
  }, {
    path: 'flatsearchform',
    loadChildren: () => import('./flat-search-form/flat-search-form.module').then(m => m.FlatSearchFormPageModule),
    canActivate: [AuthGuard]
  }, {
    path: 'userlogin',
    loadChildren: () => import('./user-login/user-login.module').then(m => m.UserLoginModule)
  }, {
    path: 'userregistration',
    loadChildren: () => import('./user-registration/user-registration.module').then(m => m.UserRegistrationModule)
  }, {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  { path: 'flat-search-form', loadChildren: './flat-search-form/flat-search-form.module#FlatSearchFormPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
