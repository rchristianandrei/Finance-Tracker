import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';

import { DashboardType } from '@app/types/dashboard';
import { Transaction, TransactionType } from '@app/types/transaction';
import { environment } from '@env/environment';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);

  private account = this.accountService.current;
  url = `${environment.apiUrl}/transaction`;

  addExpense(expense: {
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
    date: Date;
  }) {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
      type: expense.type === 'EXPENSE' ? 1 : 2,
    };
    return this.http.post(`${this.url}/${this.account()?.id}`, body);
  }

  update(transaction: Transaction) {
    const body = {
      ...transaction,
      date: transaction.date.toISOString(),
      type: transaction.type === 'EXPENSE' ? 1 : 2,
    };
    return this.http.put(`${this.url}/${transaction.id}`, body);
  }

  getDashboardData() {
    return this.http.get<DashboardType>(`${this.url}/dashboard/${this.account()?.id}`);
  }

  getTransactions(filter?: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
    pageSize?: number;
    page?: number;
  }) {
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

    return this.http.get<{
      totalCount: number;
      data: Transaction[];
    }>(`${this.url}/${this.account()?.id}`, { params });
    // .pipe(
    //   map((paginatedData) => ({
    //     ...paginatedData,
    //     data: paginatedData.data.map((t) => {
    //       const utcDate = new Date(t.date); // parse string to Date
    //       const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

    //       return {
    //         ...t,
    //         date: localDate,
    //       };
    //     }),
    //   })),
    // );
  }

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
