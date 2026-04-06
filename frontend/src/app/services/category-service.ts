import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
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
}
