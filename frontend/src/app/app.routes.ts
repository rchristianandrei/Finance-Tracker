import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        title: 'Dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
      },
    ],
  },

  {
    path: '',
    canActivateChild: [guestGuard],
    children: [
      {
        path: 'login',
        title: 'Login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/login/login').then((c) => c.Login),
      },
      {
        path: 'register',
        title: 'Register',
        loadComponent: () => import('./pages/register/register').then((c) => c.Register),
      },
    ],
  },
];
