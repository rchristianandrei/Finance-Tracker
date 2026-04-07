import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environtments/environment';
import { DashboardType } from '../types/dashboard';
import { TransactionType } from '../types/transaction';

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
    date: string;
  }) {
    return this.http.post(`${this.url}`, { ...expense, type: expense.type === 'Expense' ? 1 : 2 });
  }

  getDashboardData() {
    return this.http.get<DashboardType>(`${this.url}/dashboard`);
  }

  getTransactions(filter?: { search?: string }) {
    var urlString = `${this.url}?`;
    if (filter?.search) urlString += `Search=${filter.search}`;
    return this.http.get<TransactionType[]>(urlString);
  }
}
