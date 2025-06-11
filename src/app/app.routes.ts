import { Routes } from '@angular/router';
import { AuthGuard } from './guards/can-activate-auth';
import { AppLayout } from './layout/component/app.layout';
import { Notfound } from './pages/notfound/notfound';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/admin/pages.routes'),
  },

  {
    path: 'notfound',
    component: Notfound,
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes'),
  },
  { path: '**', redirectTo: '/notfound' },
  // {
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full',
  // },
];
