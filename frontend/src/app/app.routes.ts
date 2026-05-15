import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./components/layouts/private-layout/private-layout').then((c) => c.PrivateLayout),
    children: [
      {
        path: '',
        title: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'transactions',
        title: 'Transactions',
        loadComponent: () =>
          import('./pages/transactions/transactions').then((c) => c.Transactions),
      },
      {
        path: 'accounts',
        title: 'Accounts',
        loadComponent: () => import('./pages/accounts/accounts').then((c) => c.Accounts),
      },
      {
        path: 'categories',
        title: 'Categories',
        loadComponent: () => import('./pages/categories/categories').then((c) => c.Categories),
      },
    ],
  },
  {
    path: '',
    canActivateChild: [adminGuard],
    children: [
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./pages/users/users').then((c) => c.Users),
      },
    ],
  },
  {
    path: '',
    canActivateChild: [guestGuard],
    loadComponent: () =>
      import('./components/layouts/public-layout/public-layout').then((c) => c.PublicLayout),
    children: [
      {
        path: 'login',
        title: 'Login',
        component: Login,
      },
    ],
  },
];
