import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TransactionType } from '@app/types/transaction';
import { environment } from '@env/environment';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/category`;

  private httpClient = inject(HttpClient);
  private accountService = inject(AccountService);

  private _expenseCategories = signal<string[]>([
    'Food',
    'Transportation',
    'Bills',
    'Shopping',
    'Entertainment',
    'Health',
    'Other',
  ]);
  private _incomeCategories = signal<string[]>(['Salary', 'Other']);

  public ExpenseCategories = this._expenseCategories.asReadonly();
  public IncomeCategories = this._incomeCategories.asReadonly();

  public Create(body: { type: TransactionType; name: string }) {
    return this.httpClient.post(`${this.baseUrl}`, {
      ...body,
      type: body.type === 'EXPENSE' ? 1 : 2,
      accountId: this.accountService.selected()?.id ?? 0,
    });
  }
}
