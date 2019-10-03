import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsComponent } from './tabs.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'match',
        children: [
          {
            path: '',
            loadChildren: () => import('./match/match.module').then(m => m.MatchModule)
          }
        ]
      }, {
        path: 'preferred',
        children: [
          {
            path: '',
            loadChildren: () => import('./preferred/preferred.module').then(m => m.PreferredModule)
          }
        ]
      }, {
        path: 'userprofile',
        children: [
          {
            path: '',
            loadChildren: () => import('../user-profile/user-profile.module').then(m => m.UserProfileModule)
          }
        ]
      }, {
        path: '**',
        redirectTo: 'match'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
