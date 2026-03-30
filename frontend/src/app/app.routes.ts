import { Routes } from '@angular/router';

export const routes: Routes = [
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
];
