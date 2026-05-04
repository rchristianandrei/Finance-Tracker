import { environment } from '@env/environment';

export const CONTROLLERS = {
  auth: 'auth',
  account: 'account',
  category: 'category',
  transaction: 'transaction',
  user: 'user',
};

export const API_ROUTES = {
  category: {
    create: () => `${environment.apiUrl}/${CONTROLLERS.category}`,
    getCategories: (accountId: number) =>
      `${environment.apiUrl}/${CONTROLLERS.account}/${accountId}/categories`,
    update: (categoryId: number) => `${environment.apiUrl}/${CONTROLLERS.category}/${categoryId}`,
    delete: (categoryId: number) => `${environment.apiUrl}/${CONTROLLERS.category}/${categoryId}`,
  },
};
