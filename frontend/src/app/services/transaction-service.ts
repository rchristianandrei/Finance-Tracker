import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environtments/environment';

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
}
