import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environtments/environment';
import { DashboardType } from '../types/dashboard';
import { TransactionType } from '../types/transaction';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);

  url = `${environment.apiUrl}/transaction`;

  addExpense(expense: {
    type: 'Expense' | 'Income';
    category: string;
    amount: number;
    description: string;
    date: Date;
  }) {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
      type: expense.type === 'Expense' ? 1 : 2,
    };
    return this.http.post(`${this.url}`, body);
  }

  getDashboardData() {
    return this.http.get<DashboardType>(`${this.url}/dashboard`);
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

    return this.http
      .get<{
        totalCount: number;
        data: TransactionType[];
      }>(this.url, { params })
      .pipe(
        map((paginatedData) => ({
          ...paginatedData,
          data: paginatedData.data.map((t) => {
            const utcDate = new Date(t.date); // parse string to Date
            const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

            return {
              ...t,
              date: localDate,
            };
          }),
        })),
      );
  }
}
