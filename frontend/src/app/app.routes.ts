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
      {
        path: 'transactions',
        title: 'Transactions',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/transactions/transactions').then((c) => c.Transactions),
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
      {
        path: 'verify-account',
        title: 'Verify Account',
        loadComponent: () =>
          import('./pages/verify-account/verify-account').then((c) => c.VerifyAccount),
      },
      {
        path: 'forgot-password',
        title: 'Forgot Password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password').then((c) => c.ForgotPassword),
      },
    ],
  },
];
