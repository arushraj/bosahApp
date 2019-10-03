import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  }, {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  }, {
    path: 'userlogin',
    loadChildren: () => import('./user-login/user-login.module').then(m => m.UserLoginModule)
  }, {
    path: 'matchprofile',
    loadChildren: () => import('./list/match/match.module').then(m => m.MatchPageModule)
  }, {
    path: 'preferredprofile',
    loadChildren: () => import('./list/preferred/preferred.module').then(m => m.PreferredPageModule)
  }, {
    path: 'userregistration',
    loadChildren: () => import('./user-registration/user-registration.module').then(m => m.UserRegistrationModule)
  }, {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule),
    canActivate: [AuthGuard]
  }, {
    path: '**',
    redirectTo: 'tabs',
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
