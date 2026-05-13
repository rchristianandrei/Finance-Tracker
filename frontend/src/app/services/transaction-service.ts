import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TransactionType } from '@app/types/category';

import { DashboardType } from '@app/types/dashboard';
import { Transaction } from '@app/types/transaction';
import { environment } from '@env/environment';
import { map, pipe } from 'rxjs';
import { API_ROUTES } from './_api-routes';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  url = `${environment.apiUrl}/transaction`;

  create(
    accountId: number,
    expense: {
      type: TransactionType;
      category: string;
      amount: number;
      description: string;
      date: Date;
    },
  ) {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
      type: expense.type,
      accountId: accountId,
    };
    return this.http.post(API_ROUTES.transaction.create(), body);
  }

  readDashboardData(accountId: number) {
    return this.http.get<DashboardType>(API_ROUTES.transaction.getDashboard(accountId));
  }

  readTransactions(
    accountId: number,
    filter?: {
      search?: string;
      startDate?: Date;
      endDate?: Date;
      pageSize?: number;
      page?: number;
    },
  ) {
    let params = new HttpParams();

    if (filter?.search) {
      params = params.set('Search', filter.search);
    }

    if (filter?.startDate) {
      params = params.set('StartDate', filter.startDate.toISOString());
    }

    if (filter?.endDate) {
      params = params.set('EndDate', filter.endDate.toISOString());
    }

    if (filter?.pageSize) {
      params = params.set('PageSize', filter.pageSize);
    }

    if (filter?.page) {
      params = params.set('Page', filter.page);
    }

    return this.http
      .get<{
        totalCount: number;
        data: Transaction[];
      }>(API_ROUTES.transaction.get(accountId), { params })
      .pipe(
        map((res) => ({
          ...res,
          data: res.data.map((t) => ({
            ...t,
            date: new Date(t.date),
          })),
        })),
      );
  }

  update(transaction: Transaction) {
    const body = {
      ...transaction,
      date: transaction.date.toISOString(),
    };
    return this.http.put(API_ROUTES.transaction.update(transaction.id), body);
  }

  delete(id: number) {
    return this.http.delete(API_ROUTES.transaction.delete(id));
  }
}
